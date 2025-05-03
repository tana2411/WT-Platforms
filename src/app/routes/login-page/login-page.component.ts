import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { SetPasswordComponent } from '../set-password/set-password.component';

type ComponentName = 'login' | 'forgot-password' | 'set-password';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [
    CommonModule,
    ForgotPasswordComponent,
    LoginComponent,
    SetPasswordComponent,
  ],
})
export class LoginPageComponent implements OnInit {
  contentName = signal<ComponentName | undefined>(undefined);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      debugger;
      if (params['lost_pass'] === '1') {
        this.contentName.set('forgot-password');
      } else if (params['reset_pass'] === '1') {
        this.contentName.set('set-password');
      } else {
        this.contentName.set('login');
      }
    });
  }
}
