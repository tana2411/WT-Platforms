import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { countries } from '@app/statics';
import { TelephoneFormControlComponent } from '@app/ui';
import { strictEmailValidator } from '@app/validators';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { Company } from 'app/models';
import { SettingsService } from 'app/services/settings.service';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-edit-company-information-form',
  templateUrl: './edit-company-information-form.component.html',
  styleUrls: ['./edit-company-information-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    IconComponent,
    MatButtonModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    TelephoneFormControlComponent,
    MatDialogModule,
  ],
})
export class EditCompanyInformationFormComponent implements OnInit {
  countryList = countries.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  formGroup = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    website: new FormControl<string | null>(null, [
      Validators.pattern(
        /^(?:https?:\/\/)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,6}(?:\/[A-Za-z0-9\-._~:\/?#[\]@!$&'()*+,;=%]*)?$/,
      ),
    ]),
    registrationNumber: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    vatRegistrationCountry: new FormControl<string | null>(null, [Validators.required]),
    vatNumber: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    companyType: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    companyInterest: new FormControl<string | null>('both', [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.maxLength(500)]),
    email: new FormControl<string | null>(null, [Validators.required, strictEmailValidator()]),
    addressLine1: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(200)]),
    postalCode: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    country: new FormControl<string | null>(null, [Validators.required]),
    stateProvince: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
  });

  readonly dialogRef = inject(MatDialogRef<Company>);
  readonly data = inject<{ companyInfo: Company }>(MAT_DIALOG_DATA);
  snackBar = inject(MatSnackBar);
  settingsService = inject(SettingsService);
  submitting = signal(false);

  constructor() {}

  ngOnInit() {
    if (this.data.companyInfo) {
      const { companyInfo } = this.data;
      this.formGroup.patchValue({
        name: companyInfo?.name,
        registrationNumber: companyInfo?.registrationNumber,
        vatRegistrationCountry: companyInfo?.vatRegistrationCountry,
        vatNumber: companyInfo?.vatNumber,
        website: companyInfo?.website,
        companyType: companyInfo?.companyType,
        companyInterest: companyInfo?.companyInterest || 'both',
        description: companyInfo?.description,
        email: companyInfo?.email,
        addressLine1: companyInfo?.addressLine1,
        postalCode: companyInfo?.postalCode,
        city: companyInfo?.city,
        country: companyInfo?.country,
        stateProvince: companyInfo?.stateProvince,
        phoneNumber: companyInfo?.phoneNumber,
      });

      this.formGroup.updateValueAndValidity();
    }
  }

  submit() {
    if (this.formGroup.pristine) {
      this.snackBar.open('No changes detected. Please modify your profile details before saving.', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    this.submitting.set(true);
    const payload: any = this.formGroup.value;

    this.settingsService
      .updateCompany(this.data.companyInfo.id, payload)
      .pipe(
        catchError((err) => {
          this.snackBar.open('Company Information update failed. Please try again later.', 'OK', { duration: 3000 });
          return EMPTY;
        }),
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe((res) => {
        this.snackBar.open('Your Company Information has been updated successfully.', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      });
  }
}
