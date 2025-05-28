import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { Purchase, PurchaseFilterParams } from 'app/models/purchases.model';
import { OfferService } from 'app/services/offer.service';
import { FilterComponent } from 'app/share/ui/listing/filter/filter.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { catchError, finalize, of } from 'rxjs';
import { SpinnerComponent } from '../../../../share/ui/spinner/spinner.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
  imports: [FilterComponent, PaginationComponent, PurchaseDetailComponent, SpinnerComponent],
  providers: [OfferService],
})
export class PurchasesComponent implements OnInit {
  mapCountryCodeToName = mapCountryCodeToName;

  items = signal<Purchase[]>([]);
  filter = signal<PurchaseFilterParams | undefined>(undefined);
  loading = signal<boolean>(false);
  totalItem = signal<number>(0);
  page = signal<number>(1);
  searchTerm = signal<string | null>(null);

  snackBar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  offerService = inject(OfferService);

  constructor() {
    this.filter.set({
      skip: 0,
      limit: PAGE_SIZE,
      where: {},
    });

    this.loading.set(true);
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

    if ('country' in cleanedParams) {
      cleanedParams['location'] = [this.countryCodeToName(cleanedParams['country'] as string)];
      delete cleanedParams['country'];
    }

    this.updateFilter({
      skip: 0,
      where: Object.keys(cleanedParams).length > 0 ? { ...cleanedParams } : {},
    });

    this.refresh();
  }

  updateFilter(newFilter: Partial<PurchaseFilterParams>) {
    this.filter.update((currentFilter) => {
      const existing = currentFilter || { skip: 0, limit: PAGE_SIZE, where: {} };

      return {
        ...existing,
        ...newFilter,
        where: {
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
    this.offerService
      .getPurchases(this.filter())
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.snackBar.open(`Failed to load purchase data. Please try refreshing the page`, 'Ok', {
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

  countryCodeToName(code: string | undefined | null): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }
}
