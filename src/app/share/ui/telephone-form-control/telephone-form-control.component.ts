import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { countries } from '../../../statics/country-data';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-telephone-form-control',
  templateUrl: './telephone-form-control.component.html',
  styleUrls: ['./telephone-form-control.component.scss'],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TelephoneFormControlComponent),
      multi: true,
    },
  ],
})
export class TelephoneFormControlComponent
  implements OnInit, ControlValueAccessor
{
  @Input() isRequired: boolean = false;
  countryList = countries;

  countryCodeControl = new FormControl<any | null>(null);
  telephoneControl = new FormControl<string | null>(null, [
    Validators.maxLength(15),
    Validators.pattern(/^\d*$/),
  ]);

  onChange: ((value: any) => void) | undefined;
  onTouched: (() => void) | undefined;

  constructor() {
    this.telephoneControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.onChange) {
          this.onChange(this.getValue());
        }
      });
    this.countryCodeControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.onChange) {
          this.onChange(this.getValue());
        }
      });
  }

  ngOnInit() {
    if (this.isRequired) {
      this.countryCodeControl.setValidators(Validators.required);
      this.telephoneControl.addValidators([Validators.required]);
    }

    this.countryCodeControl.updateValueAndValidity();
    this.telephoneControl.updateValueAndValidity();
  }

  writeValue(value: any): void {
    let countryObject: any = null;
    let telephone: string | null = null;

    if (typeof value === 'string' && value) {
      const spaceIndex = value.indexOf(' ');
      let countryCodeStr: string | null = null;

      if (spaceIndex > 0) {
        countryCodeStr = value.substring(0, spaceIndex);
        telephone = value.substring(spaceIndex + 1);
        countryObject = this.countryList.find((c) => c.code === countryCodeStr);
      } else {
        telephone = value;
        countryObject = null;
      }
    } else {
      const defaultCountryCodeValue = '+44 ';
      countryObject = this.countryList.find(
        (i) => i.code == defaultCountryCodeValue,
      );
      if (!countryObject) {
        countryObject = null;
      }
      telephone = null;
    }
    this.countryCodeControl.setValue(countryObject, { emitEvent: false });
    this.telephoneControl.setValue(telephone, { emitEvent: false });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  getValue() {
    const country = this.countryCodeControl.value;
    const telephone = this.telephoneControl.value;
    if (!country || !telephone) {
      return null;
    }
    return `${country.code} ${telephone}`;
  }
}
