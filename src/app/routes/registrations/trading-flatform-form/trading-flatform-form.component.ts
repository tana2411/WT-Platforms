import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { countries } from '../../../statics/country-data';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputWithConfirmControlComponent } from '../../../share/ui/input-with-confirm-control/input-with-confirm-control.component';
import { PasswordStrength } from '../../../share/validators/password-strength';
@Component({
  selector: 'app-trading-flatform-form',
  templateUrl: './trading-flatform-form.component.html',
  styleUrls: ['./trading-flatform-form.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    InputWithConfirmControlComponent,
  ],
})
export class TradingFlatformFormComponent implements OnInit {
  countryList = countries;
  materialsAccept = [
    'LDPE',
    'PET',
    'HDPE',
    'ABS',
    'Acrylic',
    'PC',
    'PVC',
    'PP',
    'PS',
    'PA',
    'Other (Mix)',
    'Other',
    'Other (Single Sources)',
  ];

  companyInterests = ['Buyer', 'Seller', 'Both'];

  formGroup = new FormGroup({
    prefix: new FormControl<string | null>('Mr.', [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    jobTitle: new FormControl<string | null>(null, [Validators.required]),
    countryCode: new FormControl<string | null>(null, [Validators.required]),
    telePhone: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.min(8),
      PasswordStrength,
    ]),
    discoveryChannel: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    companyType: new FormControl<string | null>(null),
    companyInterest: new FormControl<string | null>(null),
    materials: new FormArray([], [Validators.required]),
  });

  selectAllMaterial = signal(false);
  showOtherMaterial = signal(false);

  constructor() {
    effect(() => {
      if (this.selectAllMaterial()) {
        this.materials.clear()
        this.materialsAccept.forEach((item) => {
          this.materials.push(new FormControl(item));
        });
      } else {
        this.materials.clear();
      }
      this.materials.updateValueAndValidity()
    });
  }

  ngOnInit() {}

  get materials(): FormArray {
    return this.formGroup.get('materials') as FormArray;
  }

  onSelectedMaterial(event: MatCheckboxChange, item: string) {
    const isOther = item === 'Other';

    if (event.checked) {
      if (!isOther) {
        const otherIdx = this.materials.controls.findIndex(
          (control) => control.value === 'Other',
        );
        if (otherIdx !== -1) {
          this.materials.removeAt(otherIdx);
          this.showOtherMaterial.set(false);
        }
      }

      this.materials.push(new FormControl(item));
    } else {
      const idx = this.materials.controls.findIndex(
        (control) => control.value === item,
      );
      if (idx !== -1) {
        this.materials.removeAt(idx);
      }
    }
    this.showOtherMaterial.set(
      this.materials.controls.some((control) => control.value === 'Other'),
    );
    this.materials.updateValueAndValidity()
  }

  send() {
    this.formGroup.markAllAsTouched()
    console.log(this.formGroup.value);
  }
}
