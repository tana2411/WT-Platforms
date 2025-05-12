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
import { ItemOf } from 'app/types/utils';
import { isEqual, omit } from 'lodash';
import { debounceTime } from 'rxjs';
import { countries, materialTypes } from '../../../../statics';
import { MAP_MATERIAL_TYPE_TO_ITEM } from './constant';

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
      value: 'location',
      type: 'select',
      options: countries,
    },
    {
      name: 'MATERIAL TYPE',
      value: 'material_type',
      type: 'select',
      options: materialTypes,
    },
    {
      name: 'ITEMS',
      value: 'item',
      type: 'select',
      options: [],
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
      value: 'fulfilled_listings',
      type: 'checkbox',
      options: [
        {
          value: 'fulfilled_listings',
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
      value: 'stored',
      type: 'checkbox',
      options: [
        {
          value: 'indoors',
          name: 'Indoors',
        },
        {
          value: 'outdoors',
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
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(), debounceTime(300)).subscribe((value) => {
      this.filterChanged.emit(value);
    });
  }

  ngOnInit() {
    if (this.displayFilter) {
      this.activeFilter = this.displayFilter.map((f) => this.allFilters.find((i) => i.value === f)).filter((i) => !!i);

      this.buildForm();
    }

    // Update the item options according the material_type value
    if (this.displayFilter.includes('item')) {
      this.filterForm
        .get('material_type')
        ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((newMaterialType) => {
          this.filterForm.get('item')?.setValue(null!);

          let itemOptions: any[] = [];
          if (newMaterialType) {
            itemOptions = MAP_MATERIAL_TYPE_TO_ITEM[newMaterialType];
          }

          this.activeFilter = this.activeFilter.map((i) => (i.value !== 'item' ? i : { ...i, options: itemOptions }));
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
