import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-account-onboarding-status',
  templateUrl: './account-onboarding-status.component.html',
  styleUrls: ['./account-onboarding-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterModule],
})
export class AccountOnboardingStatusComponent implements OnInit {
  @Input() type: 'pending' | 'completed' | 'completing' = 'pending';
  @Input() showStatusOnly = false;

  router = inject(Router);
  authService = inject(AuthService);
  constructor() { }
  ngOnInit() {
  }

  goToPlatform() {
    const targetRoute = this.authService.getDefaultRouteByRole();
    this.router.navigateByUrl(targetRoute);
  }
}
