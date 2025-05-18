import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { FilterParams, ListingMaterial } from 'app/models';
import { ListingService } from 'app/services/listing.service';
import { BiddingFormComponent } from 'app/share/ui/product-detail/bidding-form/bidding-form.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { catchError, finalize, of } from 'rxjs';
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
    BiddingFormComponent,
    SpinnerComponent,
  ],
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

  constructor() {
    this.filter.set({
      skip: 0,
      limit: PAGE_SIZE,
      where: {
        listingType: 'sell',
      },
    });
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
    this.updateFilter({
      skip: 0,
      where: Object.keys(cleanedParams).length > 0 ? { ...cleanedParams } : { listingType: 'wanted' },
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

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.listingService
      .get(currentFilter)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.snackBar.open(`${err.error?.error?.message ?? 'Unknown error'}`, 'Ok', {
            duration: 3000,
          });
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.items.set(data.results);
          this.totalItem.set(data.totalCount);
        }
      });
  }

  onBid() {
    const dialogRef = this.dialog.open(BiddingFormComponent, {
      maxWidth: '750px',
      width: '100%',
      panelClass: 'px-3',
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 'buyer-seller') {
    //     // Handle buyer/seller registration
    //     this.router.navigateByUrl('/create-account');
    //   } else if (result === 'haulier') {
    //     this.router.navigateByUrl('/create-haulier-account');
    //   }
    // });
  }
}
