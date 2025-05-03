import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { getDefaultRouteByRole } from 'app/guards/auth/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  formGroup = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  serverError = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.setupForm();
  }

  setupForm() {
    // Listen to value changes of the entire form
    this.formGroup.valueChanges.subscribe(() => {
      if (this.serverError()) {
        this.serverError.set('');
      }
    });
  }

  send() {
    this.formGroup.markAllAsTouched();

    const { email, password } = this.formGroup.value;

    if (!this.formGroup.valid || !email?.trim() || !password) {
      return;
    }

    this.authService.login({ email, password }).subscribe({
      next: () => {
        const targetRoute = this.authService.getDefaultRouteByRole();
        this.router.navigateByUrl(targetRoute);
      },
      error: (err) => {
        this.serverError.set('Invalid email address and/or password.');
      },
    });
  }
}
