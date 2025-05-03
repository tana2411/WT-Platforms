import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputWithConfirmControlComponent } from '../../share/ui/input-with-confirm-control/input-with-confirm-control.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InputWithConfirmControlComponent,
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

  get emailControl() {
    return this.formGroup.get('email') as FormControl;
  }

  constructor(private authService: AuthService) {
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
    console.log(this.formGroup.get('email')?.touched);
    this.formGroup.markAllAsTouched();
    console.log(this.emailControl.touched);

    const { email, password } = this.formGroup.value;

    if (!this.formGroup.valid || !email || !password) {
      return;
    }

    this.authService.login({ email, password }).subscribe({
      error: (err) => {
        this.serverError.set('Invalid email address and/or password.');
      },
    });
  }
}
