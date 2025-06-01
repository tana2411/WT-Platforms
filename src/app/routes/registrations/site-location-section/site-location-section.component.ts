import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Router, RouterModule } from '@angular/router';
import { materialTypes } from '@app/statics';
import { TelephoneFormControlComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { User } from 'app/models/auth.model';
import { AuthService } from 'app/services/auth.service';
import { RegistrationsService } from 'app/services/registrations.service';
import { AccountOnboardingStatusComponent } from 'app/share/ui/account-onboarding-status/account-onboarding-status.component';
import { catchError, filter, finalize, of, take } from 'rxjs';
import { countries } from './../../../statics/country-data';

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
    UpperCasePipe,
    MatExpansionModule,
  ],
})
export class SiteLocationSectionComponent implements OnInit {
  countryList = countries;

  materialTypes = materialTypes;

  formGroup = new FormGroup({
    locationName: new FormControl<string | null>(null, [Validators.required]),
    prefix: new FormControl<string | null>('mr', [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    positionInCompany: new FormControl<string | null>(null, [Validators.required]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    adressLine: new FormControl<string | null>(null, [Validators.required]),
    postcode: new FormControl<string | null>(null, [Validators.required]),
    city: new FormControl<string | null>(null, [Validators.required]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [Validators.required]),
    officeOpenTime: new FormControl<Date | null>(null, [Validators.required]),
    officeCloseTime: new FormControl<Date | null>(null, [Validators.required]),
    loadingRamp: new FormControl<boolean | null>(null, [Validators.required]),
    weighbridge: new FormControl<boolean | null>(null, [Validators.required]),
    containerType: new FormArray([], [Validators.required]),
    selfLoadUnLoadCapability: new FormControl<string | null>(null, [Validators.required]),
    accessRestrictions: new FormControl<string | null>(null, []),
  });

  submitting = signal<boolean>(false);
  selectAllContainerTypes = signal<boolean>(false);
  showAccessRestriction = signal<boolean>(false);
  usePreviousAddress = signal<boolean>(false);
  user = signal<User | undefined>(undefined);
  selectAllMaterial = signal(false);
  showOtherMaterial = signal(false);
  selectPreviousAddress = signal(false);

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  registrationService = inject(RegistrationsService);
  router = inject(Router);

  materialsAccept = computed(() => {
    const userMaterial = this.user()?.company.favoriteMaterials || [];
    return this.materialTypes
      .flatMap((type) => type.materials)
      .filter((material) => userMaterial.includes(material.code))
      .map((i) => i.code);
  });

  constructor() {
    effect(() => {
      if (this.showAccessRestriction()) {
        this.formGroup.get('accessRestrictions')?.setValidators([Validators.required]);
      } else {
        this.formGroup.get('accessRestrictions')?.clearValidators();
        this.formGroup.get('accessRestrictions')?.markAsUntouched();
      }
      this.formGroup.get('accessRestrictions')?.updateValueAndValidity();
    });

    effect(() => {
      if (this.selectAllContainerTypes()) {
        this.containerType.clear();
        this.containerType.push(new FormControl('all'));
      } else {
        this.containerType.clear();
      }
    });

    effect(() => {
      const controls = this.formGroup.controls;
      const addressFields = [
        controls.adressLine,
        controls.postcode,
        controls.city,
        controls.country,
        controls.stateProvince,
      ];
      if (this.selectPreviousAddress()) {
        this.formGroup.patchValue(
          {
            adressLine: this.user()?.company.addressLine1,
            postcode: this.user()?.company.postalCode,
            city: this.user()?.company.city,
            country: this.user()?.company.country,
            stateProvince: this.user()?.company.stateProvince,
          },
          { onlySelf: true },
        );
      } else {
        addressFields.forEach((control) => {
          control.enable();
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
          control.reset();
        });
      }

      this.formGroup.updateValueAndValidity();
    });

    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { adressLine, postcode, city, country, stateProvince } = value;
      const previousAddress = this.user()?.company;
      if (previousAddress) {
        if (
          previousAddress.addressLine1 !== adressLine ||
          previousAddress.postalCode != postcode ||
          previousAddress.city != city ||
          previousAddress.country != country ||
          previousAddress.stateProvince != stateProvince
        ) {
          this.selectPreviousAddress.set(false);
        }
      }
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

          this.formGroup.patchValue({
            prefix: user.user.prefix,
            firstName: user.user.firstName,
            lastName: user.user.lastName,
            phoneNumber: user.user.phoneNumber,
          });
        }
      });
  }

  get containerType() {
    return this.formGroup.get('containerType') as FormArray;
  }

  // get materials(): FormArray {
  //   return this.formGroup.get('favoriteMaterials') as FormArray;
  // }

  onSelectedItem(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.containerType.push(new FormControl(item));
    } else {
      const idx = this.containerType.controls.findIndex((control) => control.value === item);
      if (idx !== -1) {
        this.containerType.removeAt(idx);
      }
    }
    this.containerType.updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }

  send(navigateTo: string) {
    if (this.formGroup.invalid) return;

    const { ...value } = this.formGroup.value;
    const payload: any = {
      ...value,
      companyId: this.user()?.companyId,
      accessRestrictions: value.accessRestrictions ?? 'N/a',
    };
    navigateTo === '/account-complete-result' ? this.submitting.set(true) : this.submitting.set(false);
    this.registrationService
      .updateCompanyLocation(payload)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError((err) => {
          if (err) {
            this.snackBar.open(`${err?.error?.error?.message ?? 'Some thing went wrong. Please try again.'}`, 'Ok', {
              duration: 3000,
            });
          }
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigate(['/account-complete-result']);
        }
      });
  }

  isOpenGroup(materials: any[]) {
    return materials.some((m) => this.materialsAccept().includes(m.code));
  }
}
