import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import {
  checkPasswordStrength,
  pwdStrengthValidator,
} from '../../../share/validators/password-strength';
import { TelephoneFormControlComponent } from '../../../share/ui/telephone-form-control/telephone-form-control.component';
import { Router } from '@angular/router';
import { RegistrationsService } from 'app/services/registrations.service';
import { catchError, concatMap, finalize, of, switchMap } from 'rxjs';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitleCasePipe } from '@angular/common';
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
  ],
})
export class TradingFlatformFormComponent implements OnInit {
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
    {
      name: 'Other',
      value: 'other',
    },
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
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    whereDidYouHearAboutUs: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    otherMaterial: new FormControl<string | null>(null, [
      Validators.maxLength(100),
    ]),
    companyName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    companyInterest: new FormControl<string | null>('both', [
      Validators.required,
    ]),
    favoriteMaterials: new FormArray([], [Validators.required]),
    acceptTerm: new FormControl<boolean | null>(null, [
      Validators.requiredTrue,
    ]),
  });

  selectAllMaterial = signal(false);
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
        this.materialsAccept.forEach((item) => {
          this.materials.push(new FormControl(item.value));
        });
        this.showOtherMaterial.set(true);
      } else {
        this.showOtherMaterial.set(false);
        this.materials.clear();
      }
      this.materials.updateValueAndValidity();
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

  get materials(): FormArray {
    return this.formGroup.get('favoriteMaterials') as FormArray;
  }

  onSelectedMaterial(event: MatCheckboxChange, item: string) {
    const isOther = item === 'other';

    if (event.checked) {
      if (!isOther) {
        this.materials.push(new FormControl(item));
      } else {
        this.showOtherMaterial.set(true);
        this.formGroup
          .get('otherMaterial')
          ?.setValidators([Validators.required]);
      }
    } else {
      if (isOther) {
        this.showOtherMaterial.set(false);
        this.formGroup.get('otherMaterial')?.clearValidators();
      }
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
      otherMaterial,
    };

    this.submitting.set(true);

    this.service
      .registerTrading(payload)
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
