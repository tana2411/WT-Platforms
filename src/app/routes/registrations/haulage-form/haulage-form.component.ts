import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { countries } from './../../../statics/country-data';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
import { TelephoneFormControlComponent } from '../../../share/ui/telephone-form-control/telephone-form-control.component';
import { Router } from '@angular/router';
import { RegistrationsService } from 'app/services/registrations.service';
import { catchError, concatMap, debounceTime, finalize, of, tap } from 'rxjs';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    TelephoneFormControlComponent,
    UnAuthLayoutComponent,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    jobTitle: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    phoneNumberUser: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(15),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.email,
      Validators.required,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.minLength(8),
      Validators.required,
      Validators.min(8),
      PasswordStrength,
    ]),

    companyName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    vatRegistrationCountry: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    vatNumber: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(20),
    ]),
    addressLine1: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    postalCode: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(20),
    ]),
    city: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    phoneNumberCompany: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(15),
    ]),
    mobileNumberCompany: new FormControl<string | null>(null, [
      Validators.maxLength(15),
    ]),

    fleetType: new FormControl<string | null>(null, [Validators.required]),
    areasCovered: new FormControl<string | null>(null, [Validators.required]),
    selectedEuCountries: new FormArray([]),
    containerTypes: new FormArray([], [Validators.required]),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    expiryDate: new FormControl<Date | null>(null, [Validators.required]),
    whereDidYouHearAboutUs: new FormControl<string | null>(null, [
      Validators.required,
    ]),

    acceptTerm: new FormControl<boolean | null>(null, [
      Validators.requiredTrue,
    ]),
  });

  showEUcountry = signal(false);
  selectAllCountry = signal(false);
  selectAllContainerTypes = signal(false);
  fileError = signal<string | null>(null);
  expiryDateError = signal<string | null>(null);
  selectedFile = signal<File[]>([]);
  submitting = signal<boolean>(false);

  router = inject(Router);
  registrationService = inject(RegistrationsService);
  snackBar = inject(MatSnackBar);
  cd = inject(ChangeDetectorRef);

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

    this.formGroup?.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe((value) => {
        const { expiryDate } = value;
        const now = new Date();
        if (!value) return;

        if (expiryDate) {
          if (expiryDate < now) {
            this.expiryDateError.set('Licence expired');
          } else {
            const diffInTime = expiryDate.getTime() - now.getTime();
            const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

            if (diffInDays < 7) {
              this.expiryDateError.set('Licence is about to expire soon');
            } else {
              this.expiryDateError.set(null);
            }
          }
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

  handleFileReady(file: File[]) {
    if (file) {
      this.selectedFile.set(file);
    }
  }

  handleFileError(error: string) {
    this.fileError.set(error);
    this.cd.detectChanges();
  }

  send() {
    this.formGroup.markAllAsTouched();
    const {
      selectedEuCountries,
      wasteLicence,
      acceptTerm,
      expiryDate,
      ...value
    } = this.formGroup.value;

    if (this.selectedFile()) {
      this.registrationService
        .uploadFileHaulier(this.selectedFile())
        .pipe(
          tap(() => {
            this.submitting.set(true);
          }),
          concatMap((url) => {
            if (!url) {
              return of(null);
            }

            const payload: any = {
              ...value,
              fleetType: [value.fleetType],
              areasCovered: [value.areasCovered],
              documentType: wasteLicence ? 'waste_carrier' : null,
              documentName: this.selectedFile()?.map((file) => file.name),
              documentUrl: url,
            };

            return this.registrationService.registerHaulage(payload).pipe(
              finalize(() => this.submitting.set(false)),
              catchError((err) => {
                this.snackBar.open(
                  'An error occurred while processing your registration. Please try again.',
                  'Ok',
                  { duration: 3000 },
                );
                return of(null);
              }),
            );
          }),
          catchError((err) => {
            this.snackBar.open(
              'An error occurred while uploading the file. Please try again.',
              'Ok',
              { duration: 3000 },
            );
            return of(null);
          }),
        )
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['/public/account-pending-result']);
          }
        });
    }
  }
}
