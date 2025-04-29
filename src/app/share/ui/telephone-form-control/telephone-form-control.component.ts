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

@Component({
  selector: 'app-telephone-form-control',
  templateUrl: './telephone-form-control.component.html',
  styleUrls: ['./telephone-form-control.component.scss'],
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useClass: forwardRef(() => TelephoneFormControlComponent),
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
  telephoneControl = new FormControl<string | null>(null);

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.telephoneControl.valueChanges.subscribe((value) => {
      const countryCode = this.countryCodeControl.value?.code;
      if (countryCode) {
        const country = this.countryList.find(
          (c) => c.normalizedCode === countryCode,
        );
        if (country && country.inputMasking && value) {
          this.telephoneControl.setValue(
            this.applyMask(value, country.inputMasking),
            { emitEvent: false },
          );
        }
      }
      this.onChange(this.getValue());
    });
  }

  ngOnInit() {
    if (this.isRequired) {
      this.countryCodeControl.setValidators(Validators.required);
      this.telephoneControl.setValidators(Validators.required);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.countryCodeControl.setValue(value.countryCode);
      this.telephoneControl.setValue(value.telephone);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  getValue() {
    const countryCode = this.countryCodeControl.value;
    const telephone = this.telephoneControl.value;
    if (!countryCode || !telephone) {
      return null;
    }
    const country = this.countryList.find(
      (c) => c.normalizedCode === countryCode,
    );
    if (country && country.inputMasking) {
      const formattedTelephone = this.applyMask(
        telephone,
        country.inputMasking,
      );
      return `${country.code} ${formattedTelephone}`;
    }
    return `${countryCode} ${telephone}`;
  }

  applyMask(telephone: string, mask: string): string {
    let formattedTelephone = '';
    let telephoneIndex = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '9') {
        if (telephoneIndex < telephone.length) {
          formattedTelephone += telephone[telephoneIndex++];
        } else {
          break;
        }
      } else {
        formattedTelephone += mask[i];
      }
    }

    return formattedTelephone;
  }
}
