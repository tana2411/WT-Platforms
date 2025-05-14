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
import { packing } from '@app/statics';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { countries, materialTypes } from 'app/statics';
import { ItemOf } from 'app/types/utils';
import { isEqual, omit } from 'lodash';
import { debounceTime, distinctUntilChanged, from, switchMap } from 'rxjs';

const searchKey = 'searchTerm';

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
  allFilters = [
    {
      name: 'LOCATION',
      value: 'country',
      type: 'select',
      options: countries,
    },
    {
      name: 'MATERIAL TYPE',
      value: 'materialType',
      type: 'select',
      options: materialTypes,
    },
    {
      name: 'ITEMS',
      value: 'materialItem',
      type: 'select',
      options: [],
    },
    {
      name: 'PACKING',
      value: 'materialPacking',
      type: 'select',
      options: packing,
    },
    {
      name: 'SORT BY',
      value: 'sort_by',
      type: 'select',
      placeholder: '',
      options: [],
    },
    {
      name: 'FULFILLED LISTINGS',
      value: 'showFullfilledListing',
      type: 'checkbox',
      options: [
        {
          value: 'showFullfilledListing',
        },
      ],
    },

    {
      name: 'SOLD listings',
      value: 'sold_listings',
      type: 'checkbox',
      options: [
        {
          name: 'Show SOLD listings',
          value: 'sold_listings',
        },
      ],
    },

    {
      name: 'STORED',
      value: 'wasteStoration',
      type: 'checkbox',
      options: [
        {
          value: 'indoor',
          name: 'Indoors',
        },
        {
          value: 'outdoor',
          name: 'Outdoors',
        },
      ],
    },
  ];

  @Input() displayFilter: Array<ItemOf<typeof this.allFilters>['value']> = [];
  @Output() filterChanged = new EventEmitter<any>();

  countryList = countries;
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

  get hasFilterParams() {
    return !isEqual(omit(this.filterForm.value, searchKey), omit(this.formDefaultValue(), searchKey));
  }

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value) => {
          let wasteStoration = '';
          if (this.displayFilter.includes('wasteStoration')) {
            const indoor = this.filterForm.get('indoor')?.value;
            const outdoor = this.filterForm.get('outdoor')?.value;

            if (indoor && outdoor) {
              wasteStoration = 'both';
            }
          }

          const filter = this.normalizeFilterParams(value);
          return from(
            Promise.resolve({
              ...filter,
              wasteStoration: wasteStoration != 'both' ? filter['wasteStoration'] : wasteStoration,
            }),
          );
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this.filterChanged.emit(value);
      });
  }

  ngOnInit() {
    if (this.displayFilter) {
      this.activeFilter = this.displayFilter.map((f) => this.allFilters.find((i) => i.value === f)).filter((i) => !!i);

      this.buildForm();
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
        // case 'radio':
        //   this.addRadioControl(filter);
        //   break;
        // default:
        //   this.addSelectControl(filter);
        //   break;
      }
    });
  }

  private addSelectControl(filter: any): void {
    this.filterForm.addControl(filter.value, new FormControl<string | null>(null));
    this.formDefaultValue.set({
      ...this.formDefaultValue(),
      [filter.value]: null,
    });
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
    const checkboxFilters = this.allFilters.filter((f) => f.type === 'checkbox');

    for (const key in rawValue) {
      const value = rawValue[key];

      if (value === null || value === '' || value === false) continue;

      if (selectFilters.includes(key)) {
        result[key] = Array.isArray(value) ? value : [value];
        continue;
      }

      const isCheckbox = checkboxFilters.some((cb) => cb.options.some((opt: any) => opt.value === key));

      if (isCheckbox) {
        const parentFilter = checkboxFilters.find((filter) =>
          filter.options?.some((option) => 'value' in option && option.value === key),
        );
        if (parentFilter && Array.isArray(parentFilter.options) && parentFilter.options.length > 1) {
          if (value) {
            result[parentFilter.value] = key;
          }
        } else {
          result[key] = value;
        }
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  getOptionValue(item: any, option: any): string {
    return item.value === 'location' ? option.isoCode : option.code;
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
    this.filterForm.patchValue({
      ...this.formDefaultValue(),
      [searchKey]: this.filterForm.value[searchKey] ?? '',
    });
    this.closeFilterMobile();
  }
}
