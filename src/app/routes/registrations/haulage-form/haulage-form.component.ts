import { countries } from './../../../statics/country-data';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioModule,
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { PasswordStrength } from '../../../share/validators/password-strength';
import { InputWithConfirmControlComponent } from '../../../share/ui/input-with-confirm-control/input-with-confirm-control.component';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '../../../share/ui/file-upload/file-upload.component';
import { TelephoneFormControlComponent } from "../../../share/ui/telephone-form-control/telephone-form-control.component";
@Component({
  selector: 'app-haulage-form',
  templateUrl: './haulage-form.component.html',
  styleUrls: ['./haulage-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    InputWithConfirmControlComponent,
    MatInputModule,
    FileUploadComponent,
    TelephoneFormControlComponent
],
})
export class HaulageFormComponent implements OnInit {
  countryList = countries;
  euCountries = [
    'Austria',
    'Albania',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Czech Republic',
    'Denmark',
    'Estonia',
  ];
  containerTypes = [
    'Shipping Container',
    'Curtain Sider (Standard)',
    'Curtain Sider (High Cube)',
    'Walking Floor',
  ];

  formGroup = new FormGroup({
    prefix: new FormControl<string | null>('Mr.', [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    lastName: new FormControl<string | null>(null, [Validators.required , Validators.maxLength(50)]),
    jobTitle: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    telephone: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(15)]),
    email: new FormControl<string | null>(null, [Validators.email, Validators.required]),
    password: new FormControl<string | null>(null, [
       Validators.minLength(8),
      Validators.required,
      Validators.min(8),
      PasswordStrength,
    ]),

    companyName: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    vatLocated: new FormControl<string | null>(null, [Validators.required]),
    vatNumber: new FormControl<string | null>(null, [Validators.required,  Validators.maxLength(20)]),
    streetAddress: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    postCode: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    countryCode: new FormControl<string | null>(null, [Validators.required]),
    countryRegion: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    companyTelephone: new FormControl<string | null>(null, [
      Validators.required,
       Validators.maxLength(15)
    ]),
    companyMobile: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(15)]),

    fleetStyle: new FormControl<string | null>(null, [Validators.required]),
    areasCovered: new FormControl<string | null>(null, [Validators.required]),
    selectedEuCountries: new FormArray([]),
    containerTypes: new FormArray([], [Validators.required]),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    discoveryChannel: new FormControl<string | null>(null, [
      Validators.required,
    ]),

    acceptTerm: new FormControl<boolean | null>(null, [Validators.required])
  });

  showEUcountry = signal(false);
  selectAllCountry = signal(false);
  selectAllContainerTypes = signal(false);

  constructor() {
    effect(() => {
      if (this.selectAllContainerTypes()) {
        this.selectedContainerType.clear();
        this.containerTypes.forEach((item) => {
          this.selectedContainerType.push(new FormControl(item));
        });
      } else {
        this.selectedContainerType.clear();
      }
    });

    effect(() => {
      if (this.selectAllCountry()) {
        this.selectedEuCountries.clear();
        this.euCountries.forEach((item) => {
          this.selectedEuCountries.push(new FormControl(item));
        });
      } else {
        this.selectedEuCountries.clear();
      }
    });
  }

  ngOnInit() {}

  onAreaChange(event: MatRadioChange) {
    if (event.value === 'EU') {
      this.showEUcountry.set(true);
      this.selectedEuCountries.setValidators(Validators.required);
    } else {
      this.showEUcountry.set(false);
      this.selectedEuCountries.clearValidators();
    }
    this.selectedEuCountries.updateValueAndValidity();
  }

  get selectedEuCountries() {
    return this.formGroup.get('selectedEuCountries') as FormArray;
  }

  get selectedContainerType() {
    return this.formGroup.get('containerTypes') as FormArray;
  }

  

  onSelectedItem(event: MatCheckboxChange, item: string, formArray: FormArray) {
    if (event.checked) {
      formArray.push(new FormControl(item));
    } else {
      const idx = formArray.controls.findIndex(
        (control) => control.value === item,
      );
      if (idx !== -1) {
        formArray.removeAt(idx);
      }
    }
    formArray.updateValueAndValidity();
  }

  send() {
    this.formGroup.markAllAsTouched();
    console.log(this.formGroup);
    
  }
}
