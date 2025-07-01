import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { CompaniesService } from 'app/share/services/companies.service';
import { countries, materialTypes } from 'app/statics';
import { ItemOf } from 'app/types/utils';
import { isEqual, omit } from 'lodash';
import { debounceTime, distinctUntilChanged, EMPTY, from, switchMap } from 'rxjs';
import { allFilters, ListingSortBy } from './constant';

const searchKey = 'searchTerm';
export type PageType = 'default' | 'sellListing' | 'wanted';
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
    MatDatepickerModule,
    TranslateModule,
  ],
})
export class FilterComponent implements OnInit {
  @Input() displayFilter: Array<ItemOf<typeof allFilters>['value']> = [];
  @Input() pageType: PageType = 'default';
  @Input() customOptionValues: Record<ItemOf<typeof allFilters>['value'], any> = {};
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

  get minEndDate(): Date | null {
    return this.filterForm.get('dateRequireFrom')?.value ?? null;
  }

  get maxStartDate(): Date | null {
    return this.filterForm.get('dateRequireTo')?.value ?? null;
  }

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value: any) => {
          const hasDateRange = this.displayFilter.includes('dateRange');
          const fromCtrl = this.filterForm.get('dateRequireFrom');
          const toCtrl = this.filterForm.get('dateRequireTo');

          if (hasDateRange && fromCtrl?.dirty && value.dateRequireTo == null) {
            return EMPTY;
          }

          if (hasDateRange && toCtrl?.dirty && value.dateRequireFrom == null) {
            return EMPTY;
          }

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
        if (this.filterForm.invalid) return;
        this.filterChanged.emit({ ...value, searchTerm: this.filterForm.value[searchKey] });
      });
  }

  ngOnInit() {
    if (this.displayFilter) {
      const needsCompany = this.displayFilter.includes('company');

      if (needsCompany) {
        this.companiesService
          .getWantedCompanies('wanted')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((list) => {
            if (!list || list.length === 0) {
              return;
            }

            const wantedBuyerCompany = list.map((c) => ({ code: c.name, name: c.name }));
            this.assignFilterOptions([{ key: 'company', items: wantedBuyerCompany }]);
            this.initializeFilters();
          });
      }

      this.initializeFilters();
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
              itemOptions = selectedMaterialType.materials.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              );
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

    this.activeFilter.map((filter) => {
      if (filter.type == 'select') {
        return {
          ...filter,
          options: filter.options.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
        };
      }
      return filter;
    });

    if (this.customOptionValues) {
      this.activeFilter = this.activeFilter.map((filter) => {
        if (this.customOptionValues[filter.value]) {
          return {
            ...filter,
            options: this.customOptionValues[filter.value],
          };
        }
        return filter;
      });
    }

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
        case 'input':
          this.addInputControl(filter);
          break;
        case 'dateRange':
          this.addDateRangeControl(filter);
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

  private addInputControl(filter: any): void {
    if (!this.filterForm.get(filter.value)) {
      this.filterForm.addControl(filter.value, new FormControl<string | null>(this.getDefaultValueForFilter(filter)));
      this.formDefaultValue.set({
        ...this.formDefaultValue(),
        [filter.value]: this.getDefaultValueForFilter(filter),
      });
    }
  }

  private addDateRangeControl(filter: any): void {
    const from = 'dateRequireFrom';
    const to = 'dateRequireTo';
    if (!this.filterForm.get(from)) {
      this.filterForm.addControl(from as any, new FormControl<Date | null>(null));
      this.formDefaultValue.set({
        ...this.formDefaultValue(),
        [from]: null,
      });
    }
    if (!this.filterForm.get(to)) {
      this.filterForm.addControl(to as any, new FormControl<Date | null>(null));
      this.formDefaultValue.set({
        ...this.formDefaultValue(),
        [to]: null,
      });
    }
  }

  private normalizeFilterParams(rawValue: any) {
    const result: Record<string, any> = {};

    const selectFilters = this.allFilters.filter((f) => f.type === 'select').map((f) => f.value);
    const inputTextFilters = this.allFilters.filter((f) => f.type === 'input').map((f) => f.value);

    for (const key in rawValue) {
      const value = rawValue[key];

      if (value === null || value === '' || value === false) continue;

      if (key === 'soldListings' || key === 'showFullfilledListing') {
        // result['status'] = 'sold';
        continue;
      }

      if (selectFilters.includes(key)) {
        result[key] = Array.isArray(value) ? value : [value];
        continue;
      }

      if (inputTextFilters.includes(key)) {
        result[key] = value;
      }

      if (inputTextFilters.includes(key)) {
        result[key] = value;
      }

      result[key] = Array.isArray(value) ? value : [value];
    }

    // if (!rawValue['soldListings'] && !rawValue['showFullfilledListing']) {
    //   result['status'] = {
    //     neq: 'sold',
    //   };
    // }

    delete result['searchTerm'];

    const checkboxResult = this.normalizeCheckboxFilter(rawValue);
    Object.assign(result, checkboxResult);
    const to = result['dateRequireTo'];

    if (to == null) {
      delete result['dateRequireFrom'];
    }
    return result;
  }

  private normalizeCheckboxFilter(rawValue: any) {
    const checkboxFilters = this.allFilters.filter(
      (f) => f.type === 'checkbox' && this.displayFilter.includes(f.value),
    );
    const result: Record<string, any> = {};

    checkboxFilters.forEach((filter) => {
      const selected: string[] = [];
      const options = filter.options ?? [];

      options.forEach((option: any) => {
        const key = option.value;
        if (rawValue[key]) {
          selected.push(key);
        }
      });

      const totalOptions = options.length;
      if (totalOptions === 1) {
        const key = options[0].value;
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

    if (filter.type === 'input') {
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
    this.filterForm.markAsPristine();
    this.closeFilterMobile();
  }

  search() {
    const filterValue = this.filterForm.value;
    if (filterValue[searchKey]) {
      this.filterChanged.emit({ ...this.normalizeFilterParams(filterValue), searchTerm: filterValue[searchKey] });
    }
  }
}
