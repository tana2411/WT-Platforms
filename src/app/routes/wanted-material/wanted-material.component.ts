import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { FilterParams, ListingMaterial } from 'app/models';
import { ListingService } from 'app/services/listing.service';
import { FilterComponent } from 'app/share/ui/listing/filter/filter.component';
import { ListingFooterComponent } from 'app/share/ui/listing/listing-footer/listing-footer.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { ProductGridComponent } from 'app/share/ui/listing/product-grid/product-grid.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { catchError, finalize, of } from 'rxjs';

export const PAGE_SIZE = 10;
@Component({
  selector: 'app-wanted-material',
  templateUrl: './wanted-material.component.html',
  styleUrls: ['./wanted-material.component.scss'],
  imports: [
    CommonLayoutComponent,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent,
    ListingFooterComponent,
    SpinnerComponent,
  ],
})
export class WantedMaterialComponent implements OnInit {
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

  constructor() {
    this.filter.set({
      skip: 0,
      limit: PAGE_SIZE,
      where: {
        listingType: 'wanted',
      },
    });
  }

  ngOnInit() {}

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
          listingType: 'wanted',
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

  onSelect(item: ListingMaterial) {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.listingOfferDetail}/${item.id}`);
  }
}
