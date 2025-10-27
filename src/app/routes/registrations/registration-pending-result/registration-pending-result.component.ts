import { Component, inject, OnInit } from '@angular/core';
import { AccountOnboardingStatusComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-registration-pending-result',
  templateUrl: './registration-pending-result.component.html',
  imports: [
    AccountOnboardingStatusComponent,
    UnAuthLayoutComponent
  ]
})
export class RegistrationPendingResultComponent {
  authService = inject(AuthService);
}
