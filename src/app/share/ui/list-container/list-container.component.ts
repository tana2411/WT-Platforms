import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input, OnInit, signal, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { scrollTop } from 'app/share/utils/common';
import { ItemOf } from 'app/types/utils';
import { catchError, finalize, of } from 'rxjs';
import { allFilters } from '../listing/filter/constant';
import { FilterComponent, PageType } from '../listing/filter/filter.component';
import { PaginationComponent } from '../listing/pagination/pagination.component';
import { SpinnerComponent } from '../spinner/spinner.component';

export interface PageResult {
  results: any;
  totalCount: number | string;
}

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
  imports: [FilterComponent, PaginationComponent, SpinnerComponent, NgTemplateOutlet, TranslateModule],
  providers: [TranslatePipe],
})
export class ListContainerComponent implements OnInit {
  mapCountryCodeToName = mapCountryCodeToName;

  @Input() displayFilter: string[] = [];
  @Input() customOptionValues: Record<ItemOf<typeof allFilters>['value'], any> = {};
  @Input() fetchFn!: (filter: any) => import('rxjs').Observable<PageResult>;
  @Input() pageSize = 20;
  @Input() pageType: PageType = 'default';
  @Input() emptyMessage: string = '';
  @Input() isCountryFilter: boolean = false;
  @Input() listingType: 'sell' | 'wanted' = 'sell';

  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  page = signal(1);
  filter = signal<any>({ skip: 0, limit: this.pageSize, where: {} });
  searchTerm = signal<string | null>(null);
  loading = signal(false);
  items = signal<any[]>([]);
  total = signal(0);
  noResults = signal(false);
  invalidPage = signal(false);

  snackBar = inject(MatSnackBar);
  translate = inject(TranslatePipe);

  constructor() {
    this.loading.set(true);
  }

  ngOnInit() {}

  onPageChange(p: number) {
    this.page.set(p);
    this.updateFilter({
      skip: (p - 1) * this.pageSize,
      where: {
        ...this.filter().where,
      },
    });
    this.refresh();
  }

  onFilterChange(filterParams: any) {
    const cleanedParams = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value != null && value != '' && value != 'createAtDesc'),
    );

    if ('country' in cleanedParams) {
      if (!this.isCountryFilter) {
        cleanedParams['location'] = [this.countryCodeToName(cleanedParams['country'] as string)];
        delete cleanedParams['country'];
      } else {
        cleanedParams['country'] = [this.countryCodeToName(cleanedParams['country'] as string)];
      }
    }

    if ('sortBy' in cleanedParams) {
      cleanedParams['sortBy'] = Array.isArray(cleanedParams['sortBy'])
        ? cleanedParams['sortBy'][0]
        : cleanedParams['sortBy'];
    }

    if (this.pageType == 'wanted') {
      if ('buyerCompanyName' in cleanedParams) {
        cleanedParams['name'] = cleanedParams['buyerCompanyName'];
        delete cleanedParams['buyerCompanyName'];
      }
      Object.keys(cleanedParams).forEach((key) => {
        const val = cleanedParams[key];
        if (Array.isArray(val)) {
          cleanedParams[key] = val[0];
        }
      });
    }

    this.page.set(1);

    this.updateFilter({ skip: 0, where: { ...cleanedParams } });
    this.refresh();
  }

  private updateFilter(part: Partial<any>) {
    this.filter.update((cur) => {
      const base = cur ?? { skip: 0, limit: this.pageSize, where: {} };
      const where = { ...(part['where'] ?? {}) };
      if (this.searchTerm()) {
        where['searchTerm'] = this.searchTerm();
      }
      return {
        ...base,
        ...part,
        where,
      };
    });
  }

  private refresh() {
    this.loading.set(true);

    scrollTop();

    this.fetchFn(this.filter())
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          if (err) {
            this.snackBar.open(
              this.translate.transform(localized$(`${err.message}`)),
              this.translate.transform(localized$('OK')),
              { duration: 3000 },
            );
          }
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.items.set(res.results);
          typeof res.totalCount === 'string'
            ? this.total.set(parseInt(res.totalCount))
            : this.total.set(res.totalCount);

          this.invalidPage.set(this.total() > 0 && res.results.length === 0);
          this.noResults.set(this.total() === 0 && res.results.length === 0);
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
