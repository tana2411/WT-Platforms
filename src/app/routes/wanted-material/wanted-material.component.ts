import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  searchTerm = signal<string | null>(null);

  listingService = inject(ListingService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);

  totalPage = computed(() => {
    return Math.ceil(this.totalItem() / PAGE_SIZE);
  });
  constructor() {
    this.filter.set({
      skip: 0,
      limit: PAGE_SIZE,
      where: {
        listingType: 'wanted',
      },
    });

    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: this.searchTerm() },
        queryParamsHandling: 'merge',
      });
    });

    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search');
      if (search) {
        this.refresh();
      }
    });
  }

  ngOnInit() {}

  onPageChange(page: number) {
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
    const search = this.searchTerm() || '';
    this.listingService
      .get(currentFilter, search)
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

  // products: Product[] = [
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Available,
  //     fromDate: '2025-05-12T10:35:47.353Z',
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Required,
  //     fromDate: '2025-05-12T10:35:47.353Z',
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Available,
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Required,
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Sold,
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Expired,
  //   },
  //   {
  //     name: 'HDPE Reels - Natural',
  //     location: 'Norway',
  //     averaWeightPerLoad: '350MT',
  //     imageSrc: '',
  //     status: ProductStatus.Ongoing,
  //   },
  // ];
}
