import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountOnboardingStatusComponent } from "../../../share/ui/account-onboarding-status/account-onboarding-status.component";
import { MatIconModule } from '@angular/material/icon';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';
import { catchError, concatMap, filter, finalize, map, of, take } from 'rxjs';
import { RegistrationsService } from 'app/services/registrations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
  ]
})
export class CompanyInformationSectionComponent implements OnInit {
  formGroup = new FormGroup({
    companyType: new FormControl<string | null>(null, [Validators.required]),
    registrationNumber: new FormControl<string | null>(null, [Validators.required]),
    vatRegistrationCountry: new FormControl<string | null>(null, [Validators.required]),
    vatNumber: new FormControl<string | null>(null, [Validators.required]),
    addressLine1: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    postalCode: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
  })
  authService = inject(AuthService);
  submitting = signal(false);
  service = inject(RegistrationsService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  companyId: number | undefined;

  ngOnInit() {
    this.authService.user$.pipe(
      filter((user) => !!user),
      take(1)
    ).subscribe((user) => {
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
      });

      this.companyId = user.company?.id;
    });
  }

  submit() {
    if (this.formGroup.invalid || !this.companyId) {
      return;
    }

    this.formGroup.markAllAsTouched();
    const {
      ...payload
    }: any = this.formGroup.value;

    this.submitting.set(true);

    this.service
      .updateCompanyInfo(this.companyId, payload)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError((err) => {
          if (err) {
            this.snackBar.open(
              'An error occur while execute request, please try again.',
              'Ok',
              { duration: 3000 },
            );
          }
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/company-document']);
        }
      });
  }

}
