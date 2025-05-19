import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { strictEmailValidator } from '@app/validators';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [RouterLink, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule],
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  serverError = signal('');
  submitting = signal(false);

  router = inject(Router);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, strictEmailValidator()]],
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    // Listen to value changes of the entire form
    this.formGroup.valueChanges.subscribe(() => {
      if (this.serverError) {
        this.serverError.set('');
      }
    });
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    this.formGroup.markAllAsTouched();
    const { email } = this.formGroup.value;

    if (!this.formGroup.valid || !email) {
      return;
    }

    this.submitting.set(true);
    this.serverError.set('');
    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.snackbar.open('Please check your email with instructions on how to reset your password.');
        this.submitting.set(false);
        this.router.navigateByUrl(ROUTES_WITH_SLASH.login);
      },
      error: (err) => {
        if (err.status === 422) {
          this.snackbar.open('Please check your email with instructions on how to reset your password.');
        } else if (err.error.error.statusCode === 429) {
          this.snackbar.open('Please wait 24 hours before resending forgotten password link.');
        } else {
          this.snackbar.open('Something went wrong.');
        }

        this.submitting.set(false);
      },
    });
  }
}
