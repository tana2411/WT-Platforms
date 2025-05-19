import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputWithConfirmControlComponent } from '@app/ui';
import { checkPasswordStrength, pwdStrengthValidator } from '@app/validators';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { RequestSetPasswordParams } from 'app/types/requests/auth';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

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
    TitleCasePipe,
    InputWithConfirmControlComponent,
  ],
})
export class SetPasswordComponent implements OnInit {
  token: string | null = null;
  formGroup = new FormGroup({
    password: new FormControl<string | null>(null, [Validators.required, pwdStrengthValidator]),
  });

  serverError = signal('');
  loading = signal(false);
  pwdStrength = signal<string | null>(''); // weak, medium, strong

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
    this.formGroup?.valueChanges.pipe(takeUntilDestroyed(), debounceTime(300)).subscribe((value) => {
      const { password } = value; // expiryDate: moment type
      if (password) {
        this.pwdStrength.set(checkPasswordStrength(password));
      }
    });
  }

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

  send() {
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
        if (error?.error?.error?.message === 'Error verifying token : jwt expired') {
          this.snackbar.open('Token expired.');
        } else {
          this.snackbar.open('Something went wrong.');
        }
        this.loading.set(false);
      },
    });
  }
}
