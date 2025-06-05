import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { materialTypes } from '@app/statics';
import { InputWithConfirmControlComponent, TelephoneFormControlComponent } from '@app/ui';
import { checkPasswordStrength, pwdStrengthValidator } from '@app/validators';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';
import { RegistrationsService } from 'app/services/registrations.service';
import { catchError, concatMap, finalize, of } from 'rxjs';
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
    TelephoneFormControlComponent,
    UnAuthLayoutComponent,
    TitleCasePipe,
    UpperCasePipe,
    MatExpansionModule,
  ],
})
export class TradingFlatformFormComponent implements OnInit {
  materialsAccept = materialTypes;

  formGroup = new FormGroup({
    prefix: new FormControl<string | null>('mr', [Validators.required]),
    firstName: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    lastName: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    jobTitle: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, pwdStrengthValidator]),
    whereDidYouHearAboutUs: new FormControl<string | null>(null, [Validators.required]),
    otherMaterial: new FormControl<string | null>(null, [Validators.maxLength(100)]),
    companyName: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    companyInterest: new FormControl<string | null>(null, [Validators.required]),
    favoriteMaterials: new FormArray([], [Validators.required]),
    acceptTerm: new FormControl<boolean | null>(null, [Validators.requiredTrue]),
  });

  selectAllMaterial = signal(false);
  selectedType = signal<string | null>(null);
  showOtherMaterial = signal(false);
  submitting = signal(false);
  pwdStrength = signal<string | null>(''); // weak, medium, strong
  router = inject(Router);
  service = inject(RegistrationsService);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.selectAllMaterial()) {
        this.materials.clear();
        this.materialsAccept
          .map((m) => m.materials)
          .forEach((items) => {
            if (items.length > 0) {
              items.forEach((item) => {
                this.materials.push(new FormControl(item.code));
              });
            }
          });
        this.showOtherMaterial.set(true);
        this.materials.markAsTouched();
      } else {
        this.showOtherMaterial.set(false);
        this.materials.clear();
      }
      this.materials.updateValueAndValidity();
    });

    effect(() => {
      const { favoriteMaterials, otherMaterial } = this.formGroup.controls;
      if (this.showOtherMaterial()) {
        otherMaterial.setValidators([Validators.required]);
        favoriteMaterials.clearValidators();
      } else {
        otherMaterial.clearValidators();
        otherMaterial.setValue(null);
        otherMaterial.markAsUntouched();
        favoriteMaterials.setValidators([Validators.required]);
      }

      favoriteMaterials.updateValueAndValidity();
      otherMaterial.updateValueAndValidity();
    });
    this.formGroup
      .get('password')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value) {
          this.pwdStrength.set(checkPasswordStrength(value));
        }
      });
  }

  ngOnInit() {}

  get materials() {
    return this.formGroup.get('favoriteMaterials') as FormArray;
  }

  onSelectedMaterial(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.materials.push(new FormControl(item));
    } else {
      const idx = this.materials.controls.findIndex((control) => control.value === item);
      if (idx !== -1) {
        this.materials.removeAt(idx);
      }
    }
    this.materials.markAsTouched();
    this.materials.updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }

  send() {
    if (this.formGroup.invalid) {
      return;
    }

    this.formGroup.markAllAsTouched();
    const {
      favoriteMaterials,
      companyInterest,
      email,
      password,
      firstName,
      lastName,
      companyName,
      prefix,
      jobTitle,
      whereDidYouHearAboutUs,
      phoneNumber,
      otherMaterial,
    } = this.formGroup.value;
    const payload: any = {
      email,
      password,
      firstName,
      lastName,
      prefix,
      jobTitle,
      phoneNumber,
      whereDidYouHearAboutUs,
      companyName,
      companyInterest,
      favoriteMaterials,
    };

    if (this.showOtherMaterial()) {
      payload.otherMaterial = otherMaterial;
    }

    this.submitting.set(true);
    this.service
      .registerTrading(payload)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError((err) => {
          if (err) {
            if (err?.error?.error?.statusCode == 422 && err?.error?.error?.message == 'existed-user') {
              this.snackBar.open('This email already exists. Please enter an alternative email address', 'Ok', {
                duration: 3000,
              });
            } else {
              this.snackBar.open(`${err?.error?.error?.message ?? 'Some thing went wrong. Please try again.'}`, 'Ok', {
                duration: 3000,
              });
            }
          }
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
