import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { TelephoneFormControlComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AccountOnboardingStatusComponent } from 'app/share/ui/account-onboarding-status/account-onboarding-status.component';
import { countries } from './../../../statics/country-data';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { AuthService } from 'app/services/auth.service';
import { catchError, filter, of, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'app/types/requests/auth';

@Component({
  selector: 'app-site-location-section',
  templateUrl: './site-location-section.component.html',
  styleUrls: ['./site-location-section.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AccountOnboardingStatusComponent,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    RouterModule,
    ReactiveFormsModule,
    UnAuthLayoutComponent,
    TelephoneFormControlComponent,
    MatTimepickerModule,
    MatCheckboxModule,
  ],
})
export class SiteLocationSectionComponent implements OnInit {
  countryList = countries;

  materialsAccept = [
    {
      name: 'LDPE',
      value: 'ldpe',
    },
    {
      name: 'PP',
      value: 'pp',
    },
    {
      name: 'PC',
      value: 'pc',
    },
    {
      name: 'ABS',
      value: 'abs',
    },
    {
      name: 'Acrylic',
      value: 'acrylic',
    },
    {
      name: 'Granulates',
      value: 'granulates',
    },
    {
      name: 'HDPE',
      value: 'hdpe',
    },
    {
      name: 'PVC',
      value: 'pvc',
    },
    {
      name: 'PET',
      value: 'pet',
    },
    {
      name: 'PA',
      value: 'pa',
    },
    {
      name: 'PS',
      value: 'ps',
    },
    {
      name: 'Other (Mix)',
      value: 'other (mix)',
    },
    {
      name: 'Other (Single Sources)',
      value: 'other (single sources)',
    },
  ];

  formGroup = new FormGroup({
    locationName: new FormControl<string | null>(null, [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    positionInCompany: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    addressLine: new FormControl<string | null>(null, [Validators.required]),
    postCode: new FormControl<string | null>(null, [Validators.required]),
    city: new FormControl<string | null>(null, [Validators.required]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [Validators.required]),
    officeOpenTime: new FormControl<Date | null>(null, [Validators.required]),
    officeCloseTime: new FormControl<Date | null>(null, [Validators.required]),
    favoriteMaterials: new FormArray([], [Validators.required]),
    otherMaterial: new FormControl<string | null>(null, [
      Validators.maxLength(100),
    ]),
    loadingRamp: new FormControl<boolean | null>(null, [Validators.required]),
    weighbridge: new FormControl<boolean | null>(null, [Validators.required]),
    containerType: new FormArray([], [Validators.required]),
    selfLoadUnloadCapability: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    accessRestrictions: new FormControl<string | null>(null, []),
  });

  submitting = signal<boolean>(false);
  selectAllContainerTypes = signal<boolean>(false);
  showAccessRestriction = signal<boolean>(false);
  usePreviousAddress = signal<boolean>(false);
  user = signal<User | undefined>(undefined);
  selectAllMaterial = signal(false);
  showOtherMaterial = signal(false);

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (this.showAccessRestriction()) {
        this.formGroup
          .get('accessRestrictions')
          ?.setValidators([Validators.required]);
      } else {
        this.formGroup.get('accessRestrictions')?.clearValidators();
        this.formGroup.get('accessRestrictions')?.markAsUntouched();
      }
      this.formGroup.get('accessRestrictions')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.authService.user$
      .pipe(
        filter((user) => !!user),
        take(1),
        catchError((err) => {
          if (err) {
            this.snackBar.open(
              'An error occurred while retrieving your information. Please refresh the page or contact support if the problem persists.',
              'Ok',
              { duration: 3000 },
            );
          }
          return of(null);
        }),
      )
      .subscribe((user) => {
        if (user) {
          this.user.set(user);
        }
      });
  }

  get containerType() {
    return this.formGroup.get('containerType') as FormArray;
  }

  onSelectedItem(event: MatCheckboxChange, item: string) {}

  onUsePreviousAddressChange(event: MatCheckboxChange) {
    const controls = this.formGroup.controls;
    const addressFields = [
      controls.addressLine,
      controls.postCode,
      controls.city,
      controls.country,
      controls.stateProvince,
    ];
    if (event.checked) {
      this.formGroup.patchValue(
        {
          addressLine: this.user()?.company.addressLine1,
          postCode: this.user()?.company.postalCode,
          city: this.user()?.company.city,
          country: this.user()?.company.country,
          stateProvince: this.user()?.company.stateProvince,
        },
        { onlySelf: true },
      );
      // addressFields.forEach((control) => {
      //   control.setValue('');
      //   control.clearValidators();
      //   control.markAsUntouched();
      // });
    } else {
      addressFields.forEach((control) => {
        control.enable();
        control.setValidators(Validators.required);
        control.updateValueAndValidity();
      });
    }

    this.formGroup.updateValueAndValidity();
  }

  get materials(): FormArray {
    return this.formGroup.get('favoriteMaterials') as FormArray;
  }

  onSelectedMaterial(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.materials.push(new FormControl(item));
    } else {
      const idx = this.materials.controls.findIndex(
        (control) => control.value === item,
      );
      if (idx !== -1) {
        this.materials.removeAt(idx);
      }
    }
    this.materials.updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }
}
