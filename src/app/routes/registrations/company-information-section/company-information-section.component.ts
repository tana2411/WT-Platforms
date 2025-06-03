import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { countries } from '@app/statics';
import { AccountOnboardingStatusComponent, TelephoneFormControlComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';
import { RegistrationsService } from 'app/services/registrations.service';
import { catchError, concatMap, filter, finalize, of, take } from 'rxjs';

@Component({
  selector: 'app-company-information-section',
  templateUrl: './company-information-section.component.html',
  styleUrls: ['./company-information-section.component.scss'],
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
  ],
})
export class CompanyInformationSectionComponent implements OnInit {
  countryList = countries.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  formGroup = new FormGroup({
    companyType: new FormControl<string | null>(null, [Validators.required]),
    registrationNumber: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    vatRegistrationCountry: new FormControl<string | null>(null, [Validators.required]),
    vatNumber: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    addressLine1: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    postalCode: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    mobileNumber: new FormControl<string | null>(null, [Validators.maxLength(15)]),
  });
  authService = inject(AuthService);
  submitting = signal(false);
  service = inject(RegistrationsService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  companyId: number | undefined;

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
        if (user?.company) {
          this.formGroup.patchValue({
            companyType: user.company?.companyType ?? '',
            registrationNumber: user.company?.registrationNumber ?? '',
            vatRegistrationCountry: user.company?.vatRegistrationCountry ?? '',
            vatNumber: user.company?.vatNumber ?? '',
            addressLine1: user.company?.addressLine1 ?? '',
            postalCode: user.company?.postalCode ?? '',
            city: user.company?.city ?? '',
            country: user.company?.country ?? '',
            stateProvince: user.company?.stateProvince ?? '',
            phoneNumber: user.company.phoneNumber ?? '',
            mobileNumber: user.company.mobileNumber ?? '',
          });

          this.companyId = user.company?.id;
        }
      });
  }

  submit(navigateTo: string) {
    if (this.formGroup.invalid || !this.companyId) {
      return;
    }

    this.formGroup.markAllAsTouched();
    const { ...payload }: any = this.formGroup.value;

    navigateTo === '/company-document' ? this.submitting.set(true) : this.submitting.set(false);

    this.service
      .updateCompanyInfo(this.companyId, payload)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError((err) => {
          if (err) {
            this.snackBar.open('Failed to submit your information due to a network error. Please try again.', 'Ok', {
              duration: 3000,
            });
          }
          return of(null);
        }),
        // refresh /me to set latest user data into auth service
        concatMap((res) => {
          if (res) {
            return this.authService.checkToken();
          }
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate([navigateTo]);
        }
      });
  }
}
