import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  serverError = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
    this.formGroup.markAllAsTouched();
    const { email } = this.formGroup.value;

    if (!this.formGroup.valid || !email) {
      return;
    }
    this.serverError.set('');
    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.snackbar.open(
          'Forgot password link has been sent, please check your email.',
        );
      },
      error: (err) => {
        debugger;
        if (err.status === 422) {
          this.snackbar.open(
            'Please check your email with instructions on how to reset your password.',
          );
        } else {
          this.snackbar.open('Something went wrong.');
        }
      },
    });
  }
}
