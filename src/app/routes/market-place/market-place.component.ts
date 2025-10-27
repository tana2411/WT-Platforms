import { Component, EnvironmentInjector, inject, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { FilterParams, ListingMaterial } from 'app/models';
import { ListingService } from 'app/services/listing.service';
import { ConfirmModalComponent, ConfirmModalProps } from 'app/share/ui/confirm-modal/confirm-modal.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { UnsuccessfulSearchComponent } from 'app/share/ui/unsuccessful-search/unsuccessful-search.component';
import { scrollTop } from 'app/share/utils/common';
import { catchError, EMPTY, finalize, of, switchMap } from 'rxjs';
import { FilterComponent } from '../../share/ui/listing/filter/filter.component';
import { ListingFooterComponent } from '../../share/ui/listing/listing-footer/listing-footer.component';
import { PaginationComponent } from '../../share/ui/listing/pagination/pagination.component';
import { ProductGridComponent } from '../../share/ui/listing/product-grid/product-grid.component';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss'],
  imports: [
    CommonLayoutComponent,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent,
    ListingFooterComponent,
    MatDialogModule,
    SpinnerComponent,
    UnsuccessfulSearchComponent,
    TranslateModule,
  ],
  providers: [TranslatePipe],
})
export class MarketPlaceComponent {
  items = signal<ListingMaterial[]>([]);
  filter = signal<FilterParams | undefined>(undefined);
  loading = signal<boolean>(false);
  totalItem = signal<number>(0);
  page = signal<number>(1);
  searchTerm = signal<string | null>(null);

  listingService = inject(ListingService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  private injector = inject(EnvironmentInjector);
  private translate = inject(TranslatePipe);

  constructor() {
    this.filter.set({
      skip: 0,
      limit: PAGE_SIZE,
      where: {
        listingType: 'sell',
      },
    });
    this.loading.set(true);
  }

  onPageChange(page: number) {
    this.page.set(page);
    this.updateFilter({
      ...this.filter(),
      skip: (page - 1) * PAGE_SIZE,
    });
    this.refresh();
  }

  onFilterChange(filterParams: any) {
    const cleanedParams = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value != null && value != '' && value != 'All'),
    );
    this.page.set(1);
    this.updateFilter({
      skip: 0,
      where: Object.keys(cleanedParams).length > 0 ? { ...cleanedParams } : { listingType: 'sell' },
    });

    this.refresh();
  }

  updateFilter(newFilter: Partial<FilterParams>) {
    this.filter.update((currentFilter) => {
      const existing = currentFilter || { skip: 0, limit: PAGE_SIZE, where: {} };

      return {
        ...existing,
        ...newFilter,
        where: {
          listingType: existing.where.listingType,
          ...newFilter.where,
        },
      };
    });
  }

  refresh() {
    const currentFilter = this.filter();
    this.loading.set(true);

    scrollTop();

    this.listingService
      .get(currentFilter)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.snackBar.open(
            `${err.error?.error?.message ?? this.translate.transform(localized$('Failed to apply filters. Please try again.'))}`,
          );
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.items.set(data.results);
          this.totalItem.set(typeof data.totalCount == 'string' ? parseInt(data.totalCount) : data.totalCount);
        }
      });
  }

  onSelect(item: ListingMaterial) {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.listingOfferDetail}/${item.id}`);
  }

  deleteItem(item: ListingMaterial) {
    runInInjectionContext(this.injector, () => {
      this.dialog
        .open<ConfirmModalComponent, ConfirmModalProps>(ConfirmModalComponent, {
          maxWidth: '500px',
          width: '100%',
          panelClass: 'px-3',
          data: {
            title: localized$('Are you sure you want to remove this listing? This action cannot be undone.'),
          },
        })
        .afterClosed()
        .pipe(
          takeUntilDestroyed(),
          switchMap((shouldDelete) => {
            if (!shouldDelete) {
              return EMPTY;
            }

            return this.listingService.delete(item.id);
          }),
          catchError(() => {
            // if (err?.error?.error?.statusCode == 403) {
            //   this.snackBar.open('You do not have permission to remove this listing.', 'Ok', {
            //     duration: 3000,
            //   });
            // } else {
            this.snackBar.open(
              this.translate.transform(localized$('Failed to remove the listing. Please try again later.')),
            );

            return EMPTY;
            // }
          }),
        )
        .subscribe(() => {
          this.snackBar.open(this.translate.transform(localized$('Your listing has been successfully removed.')));
          this.refresh();
        });
    });
  }
}
