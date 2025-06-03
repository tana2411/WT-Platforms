import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { CompaniesService } from 'app/share/services/companies.service';
import { countries, materialTypes } from 'app/statics';
import { ItemOf } from 'app/types/utils';
import { isEqual, omit } from 'lodash';
import { debounceTime, distinctUntilChanged, from, switchMap } from 'rxjs';
import { allFilters, ListingSortBy, listingSortOption } from './constant';

const searchKey = 'searchTerm';
export type PageType = 'default' | 'sellListing';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    IconComponent,
  ],
})
export class FilterComponent implements OnInit {
  @Input() displayFilter: Array<ItemOf<typeof this.allFilters>['value']> = [];
  @Input() pageType: PageType = 'default';
  @Output() filterChanged = new EventEmitter<any>();
  @Output() searchTerm = new EventEmitter<string | null>();

  countryList = countries.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  allFilters = allFilters;
  activeFilter: any[] = [];

  filterForm = new FormGroup({
    [searchKey]: new FormControl<string | null>(null),
  });

  // store the default value after build form
  // we use it for clear filter, tracking has filter or not
  formDefaultValue = signal({});
  openMobileFilter = signal(false);
  backupMobileFilterParams: any = undefined;
  destroyRef = inject(DestroyRef);
  companiesService = inject(CompaniesService);

  get hasFilterParams() {
    return !isEqual(omit(this.filterForm.value, searchKey), omit(this.formDefaultValue(), searchKey));
  }

  sortByMappings: Record<PageType, { code: string; name: string }[]> = {
    default: [{ code: 'availableListings', name: 'Available Listings' }],
    sellListing: listingSortOption,
  };

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value) => {
          if (value[searchKey] == '') {
            const filter = this.normalizeFilterParams(value);
            return from(Promise.resolve({ ...filter, searchTerm: null }));
          }

          const filter = this.normalizeFilterParams(value);

          return from(Promise.resolve(filter));
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this.filterChanged.emit({ ...value, searchTerm: this.filterForm.value[searchKey] });
      });
  }

  ngOnInit() {
    const sortOption = this.sortByMappings[this.pageType] || [];

    if (this.displayFilter) {
      const needsBuyer = this.displayFilter.includes('buyerCompanyName');
      const needsSeller = this.displayFilter.includes('sellerCompanyName');
      const needsCompany = this.displayFilter.includes('company');
      const needsSortBy = this.displayFilter.includes('sortBy');

      if (needsSortBy) {
        this.allFilters = this.allFilters.map((f) => (f.value == 'sortBy' ? { ...f, options: sortOption } : f));
      }

      if (needsBuyer || needsSeller) {
        this.companiesService
          .getOfferCompanies()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(({ buyer, seller }) => {
            this.assignFilterOptions([
              { key: 'buyerCompanyName', items: buyer },
              { key: 'sellerCompanyName', items: seller },
            ]);
            this.initializeFilters();
          });
      } else if (needsCompany) {
        this.companiesService
          .getCompanies('sell')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((list) => {
            this.assignFilterOptions([{ key: 'company', items: list }]);
            this.initializeFilters();
          });
      } else {
        this.initializeFilters();
      }
    }

    // Update the item options according the material_type value
    if (this.displayFilter.includes('materialItem')) {
      this.filterForm
        .get('materialType')
        ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((newMaterialType) => {
          this.filterForm.get('materialItem')?.setValue(null!);

          let itemOptions: any[] = [];
          if (newMaterialType) {
            const selectedMaterialType = materialTypes.find((m) => m.code == newMaterialType);
            if (selectedMaterialType) {
              itemOptions = selectedMaterialType.materials;
            }
          }

          this.activeFilter = this.activeFilter.map((i) =>
            i.value !== 'materialItem' ? i : { ...i, options: itemOptions },
          );
        });
    }
  }

  private initializeFilters() {
    this.activeFilter = this.displayFilter
      .map((val) => this.allFilters.find((f) => f.value === val))
      .filter((f): f is typeof f => !!f);
    this.buildForm();
  }

  private assignFilterOptions(mappings: Array<{ key: string; items: { name: string }[] }>) {
    this.allFilters = this.allFilters.map((f) => {
      const m = mappings.find((x) => x.key === f.value);
      if (!m) return f;

      const options = m.items.map((c) => ({ code: c.name, name: c.name }));
      return { ...f, options };
    });
  }

  buildForm(): void {
    if (!this.activeFilter || this.activeFilter.length === 0) return;

    if (Object.keys(this.filterForm.controls).length > 1) {
      const searchValue = this.filterForm.get(searchKey)?.value;
      if (searchValue) {
        this.filterForm = new FormGroup({
          searchTerm: new FormControl<string | null>(searchValue),
        });

        this.formDefaultValue.set({
          ...this.formDefaultValue(),
          searchTerm: searchValue,
        });
      }
    }

    this.activeFilter.forEach((filter: any) => {
      switch (filter.type) {
        case 'select':
          this.addSelectControl(filter);
          break;
        case 'checkbox':
          this.addCheckboxControls(filter);
          break;
      }
    });
  }

  private addSelectControl(filter: any): void {
    if (!this.filterForm.get(filter.value)) {
      this.filterForm.addControl(filter.value, new FormControl<string | null>(this.getDefaultValueForFilter(filter)));
      this.formDefaultValue.set({
        ...this.formDefaultValue(),
        [filter.value]: this.getDefaultValueForFilter(filter),
      });
    }
  }

  private addCheckboxControls(filter: any): void {
    if (filter.options && filter.options.length > 0) {
      filter.options.forEach((option: any) => {
        const controlName = option.value;
        this.filterForm.addControl(controlName, new FormControl<boolean>(false));
        this.formDefaultValue.set({
          ...this.formDefaultValue(),
          [controlName]: false,
        });
      });
    }
  }

  private normalizeFilterParams(rawValue: any) {
    const result: Record<string, any> = {};

    const selectFilters = this.allFilters.filter((f) => f.type === 'select').map((f) => f.value);

    for (const key in rawValue) {
      const value = rawValue[key];

      if (value === null || value === '' || value === false) continue;

      if (selectFilters.includes(key)) {
        result[key] = Array.isArray(value) ? value : [value];
        continue;
      }
    }

    const checkboxResult = this.normalizeCheckboxFilter(rawValue);
    Object.assign(result, checkboxResult);
    return result;
  }

  private normalizeCheckboxFilter(rawValue: any) {
    const checkboxFilters = this.allFilters.filter(
      (f) => f.type === 'checkbox' && this.displayFilter.includes(f.value),
    );
    const result: Record<string, any> = {};

    checkboxFilters.forEach((filter) => {
      const selected: string[] = [];

      filter.options.forEach((option: any) => {
        const key = option.value;
        if (rawValue[key]) {
          selected.push(key);
        }
      });

      const totalOptions = filter.options.length;
      if (totalOptions === 1) {
        const key = filter.options[0].value;
        if (rawValue[key]) {
          result[filter.value] = rawValue[key] === true;
        }
      }

      if (totalOptions === 2) {
        if (selected.length === totalOptions) {
          result[filter.value] = null;
        }

        if (selected.length === 1) {
          result[filter.value] = selected[0];
        }

        if (selected.length === 0) {
          result[filter.value] = null;
        }
      }
    });
    return result;
  }

  private getDefaultValueForFilter(filter: any): string | null {
    if (filter.value !== 'sortBy') {
      return null;
    }

    const options = filter.options || [];

    if (this.pageType === 'default') {
      return options[0]?.code ?? null;
    }

    return options.find((opt: any) => opt.code === ListingSortBy.DEFAULT)?.code ?? null;
  }

  getOptionValue(item: any, option: any): string {
    return item.value === 'country' ? option.isoCode : option.code;
  }

  openFilterMobile() {
    this.openMobileFilter.set(true);
    this.backupMobileFilterParams = omit(this.filterForm.value, searchKey);
  }

  closeFilterMobile() {
    this.openMobileFilter.set(false);
  }

  onUpdateFilter() {
    this.closeFilterMobile();
  }

  onCloseFilterMobile() {
    this.closeFilterMobile();
    // reset the old filter
    this.filterForm.patchValue({
      [searchKey]: this.filterForm.value[searchKey],
      ...this.backupMobileFilterParams,
    });
  }

  clearFilter() {
    const patchValue: any = {
      ...this.formDefaultValue(),
      [searchKey]: this.filterForm.value[searchKey] ?? '',
    };
    if (this.filterForm.contains('sortBy')) {
      patchValue['sortBy'] = this.getDefaultValueForFilter(this.activeFilter.find((f) => f.value === 'sortBy'));
    }

    this.filterForm.patchValue(patchValue);
    this.closeFilterMobile();
  }

  search() {
    const filterValue = this.filterForm.value;
    if (filterValue[searchKey]) {
      this.filterChanged.emit({ ...this.normalizeFilterParams(filterValue), searchTerm: filterValue[searchKey] });
    }
  }
}
