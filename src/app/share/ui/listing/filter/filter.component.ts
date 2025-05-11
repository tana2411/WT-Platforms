import { debounceTime, pipe, map } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { countries, materialTypes } from '../../../../statics';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
      name: 'MATERIAL GROUP',
      value: 'material_group',
    },
    {
      name: 'MATERIALS',
      value: 'materials',
    },
    {
      name: 'PACKING*',
      value: 'packing',
    },
    {
      name: 'SORT BY',
      value: 'sort_by',
      type: 'select',
      placeholder: "",
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
      name: 'Show SOLD listings',
      value: 'sold_listings',
      type: 'checkbox',
      options: [
        {
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

  @Input() displayFilter: string[] = [];
  @Output() filterChanged = new EventEmitter<any>();

  countryList = countries;
  activeFilter: any;

  filterForm = new FormGroup({
    searchTerm: new FormControl<string | null>(null),
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe((value) => {
        this.filterChanged.emit(value);
      });
  }

  ngOnInit() {
    if (this.displayFilter) {
      this.activeFilter = this.displayFilter.map((f) =>
        this.allFilters.find((i) => i.value === f),
      );

      this.buildForm();
    }
  }

  buildForm(): void {
    if (!this.activeFilter || this.activeFilter.length === 0) return;

    if (Object.keys(this.filterForm.controls).length > 1) {
      const searchValue = this.filterForm.get('searchTerm')?.value;
      if (searchValue) {
        this.filterForm = new FormGroup({
          searchTerm: new FormControl<string | null>(searchValue),
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
    this.filterForm.addControl(
      filter.value,
      new FormControl<string | null>(null),
    );
  }

  private addCheckboxControls(filter: any): void {
    if (filter.options && filter.options.length > 0) {
      filter.options.forEach((option: any) => {
        const controlName = option.value;
        this.filterForm.addControl(
          controlName,
          new FormControl<boolean>(false),
        );
      });
    }
  }

  getOptionValue(item: any, option: any): string {
    return item.value === 'location' ? option.isoCode : option.code;
  }
}
