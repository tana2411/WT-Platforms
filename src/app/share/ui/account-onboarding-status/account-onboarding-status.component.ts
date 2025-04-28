import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-onboarding-status',
  templateUrl: './account-onboarding-status.component.html',
  styleUrls: ['./account-onboarding-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  standalone: true
})
export class AccountOnboardingStatusComponent implements OnInit {
  type: 'pending' | 'complete' = 'complete'

  router = inject(Router)
  constructor() { }
  ngOnInit() {
  }

}
