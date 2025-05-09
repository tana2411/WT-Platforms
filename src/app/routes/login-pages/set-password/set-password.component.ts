import { Component, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { RequestSetPasswordParams } from 'app/types/requests/auth';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class SetPasswordComponent implements OnInit {
  token: string | null = null;
  formGroup = new FormGroup(
    {
      password: new FormControl<string>('', [
        Validators.required,
        this.passwordPatternValidator,
      ]),
      confirmPassword: new FormControl<string>('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  serverError = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Get token from URL and validate it
    this.route.queryParams.subscribe((params) => {
      this.token = params['key'];
      if (!this.token) {
        this.router.navigate(['/login']);
        return;
      }
    });
  }

  private passwordPatternValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    return PASSWORD_PATTERN.test(control.value)
      ? null
      : { passwordStrength: true };
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This is a required field.';
    }

    if (control.hasError('passwordStrength')) {
      return 'Passwords must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, and one number.';
    }

    if (
      this.formGroup.hasError('passwordMismatch') &&
      controlName === 'confirmPassword'
    ) {
      return 'Passwords do not match.';
    }

    return '';
  }

  send() {
    console.log(this.formGroup);
    if (this.loading()) {
      return;
    }

    if (this.formGroup.invalid || !this.token) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const { password } = this.formGroup.value;

    this.loading.set(true);
    const params: RequestSetPasswordParams = {
      newPassword: password!,
      confirmNewPassword: password!,
      resetPasswordToken: this.token,
    };

    this.authService.setPassword(params).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackbar.open('Password set successfully.');
        this.router.navigateByUrl(ROUTES_WITH_SLASH.login);
      },
      error: (error) => {
        if (
          error?.error?.error?.message === 'Error verifying token : jwt expired'
        ) {
          this.snackbar.open('Token expired.');
        } else {
          this.snackbar.open('Something went wrong.');
        }
        this.loading.set(false);
      },
    });
  }
}
