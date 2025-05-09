import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { countries } from './../../../statics/country-data';
import {
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
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { checkPasswordStrength } from '../../../share/validators/password-strength';
import { InputWithConfirmControlComponent } from '../../../share/ui/input-with-confirm-control/input-with-confirm-control.component';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '../../../share/ui/file-upload/file-upload.component';
import { TelephoneFormControlComponent } from '../../../share/ui/telephone-form-control/telephone-form-control.component';
import { Router } from '@angular/router';
import { RegistrationsService } from 'app/services/registrations.service';
import { catchError, concatMap, debounceTime, finalize, of } from 'rxjs';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from 'app/services/auth.service';
import { TitleCasePipe } from '@angular/common';
import { strictEmailValidator } from 'app/share/validators/';
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
    TitleCasePipe,
  ],
  providers: [provideNativeDateAdapter()],
})
export class HaulageFormComponent implements OnInit {
  countryList = countries;
  euCountries = [
    { value: 'austria', name: 'Austria' },
    { value: 'belgium', name: 'Belgium' },
    { value: 'bulgaria', name: 'Bulgaria' },
    { value: 'croatia', name: 'Croatia' },
    { value: 'czech_republic', name: 'Czech Republic' },
    { value: 'denmark', name: 'Denmark' },
    { value: 'estonia', name: 'Estonia' },
    { value: 'cyprus', name: 'Cyprus' },
    { value: 'finland', name: 'Finland' },
    { value: 'france', name: 'France' },
    { value: 'germany', name: 'Germany' },
    { value: 'greece', name: 'Greece' },
    { value: 'hungary', name: 'Hungary' },
    { value: 'ireland', name: 'Ireland' },
    { value: 'italy', name: 'Italy' },
    { value: 'latvia', name: 'Latvia' },
    { value: 'lithuania', name: 'Lithuania' },
    { value: 'luxembourg', name: 'Luxembourg' },
    { value: 'malta', name: 'Malta' },
    { value: 'netherlands', name: 'Netherlands' },
    { value: 'poland', name: 'Poland' },
    { value: 'portugal', name: 'Portugal' },
    { value: 'romania', name: 'Romania' },
    { value: 'slovakia', name: 'Slovakia' },
    { value: 'slovenia', name: 'Slovenia' },
    { value: 'spain', name: 'Spain' },
    { value: 'sweden', name: 'Sweden' },
  ];
  containerTypes = [
    { value: 'shipping_container', name: 'Shipping Container' },
    { value: 'curtain_slider_standard', name: 'Curtain Sider (Standard)' },
    { value: 'curtain_slider_high_cube', name: 'Curtain Sider (High Cube)' },
    { value: 'walking_floor', name: 'Walking Floor' },
  ];

  formGroup = new FormGroup({
    prefix: new FormControl<string | null>('mr', [Validators.required]),
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
    ]),
    email: new FormControl<string | null>(null, [
      strictEmailValidator(),
      Validators.required,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.minLength(8),
      Validators.required,
    ]),

    companyName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    registrationNumber: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(20),
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
      Validators.pattern(/^\d*$/),
    ]),

    fleetType: new FormControl<string | null>(null, [Validators.required]),
    areasCovered: new FormArray([], []),
    containerTypes: new FormArray([], [Validators.required]),
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
  pwdStrength = signal<string | null>(''); // weak, medium, strong

  router = inject(Router);
  registrationService = inject(RegistrationsService);
  snackBar = inject(MatSnackBar);
  cd = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.selectAllContainerTypes()) {
        this.selectedContainerType.clear();
        this.selectedContainerType.push(new FormControl('all'));
        this.selectedContainerType.markAsTouched();
      } else {
        this.selectedContainerType.clear();
      }
    });

    effect(() => {
      if (this.selectAllCountry()) {
        this.selectedAreasCovered.clear();
        this.euCountries.forEach((item) => {
          this.selectedAreasCovered.push(new FormControl(item.value));
        });
        this.selectedAreasCovered.markAsTouched();
      } else {
        this.selectedAreasCovered.clear();
      }
    });

    this.formGroup?.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe((value) => {
        const { expiryDate, password } = value;
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
        if (password) {
          this.pwdStrength.set(checkPasswordStrength(password));
        }
      });
  }

  ngOnInit() {}

  onAreaChange(event: MatRadioChange) {
    this.selectedAreasCovered.clear();
    if (event.value === 'EU') {
      this.showEUcountry.set(true);
      this.selectedAreasCovered.setValidators(Validators.required);
    } else {
      this.showEUcountry.set(false);
      this.selectedAreasCovered.clearValidators();
      this.selectedAreasCovered.push(new FormControl(event.value));
    }

    this.selectedAreasCovered.updateValueAndValidity();
  }

  get selectedAreasCovered() {
    return this.formGroup.get('areasCovered') as FormArray;
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
    formArray.markAllAsTouched();
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
    const { acceptTerm, expiryDate, ...value } = this.formGroup.value;

    if (this.selectedFile().length > 0) {
      this.submitting.set(true);
      this.registrationService
        .uploadFileHaulier(this.selectedFile())
        .pipe(
          finalize(() => this.submitting.set(false)),
          concatMap((url) => {
            if (!url) {
              return of(null);
            }

            const payload: any = {
              ...value,
              documentType: 'waste_carrier',
              documentName: this.selectedFile()[0].name,
              documentUrl: url,
            };

            return this.registrationService.registerHaulage(payload).pipe(
              catchError((err) => {
                this.snackBar.open(`${err.error.error.message}`, 'Ok', {
                  duration: 3000,
                });
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
          concatMap((res) => {
            if (!res) {
              return of(null);
            }
            this.authService.setToken(res.data.accessToken);
            return this.authService.checkToken();
          }),
        )
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['/account-pending-result']);
          }
        });
    }
  }
}
