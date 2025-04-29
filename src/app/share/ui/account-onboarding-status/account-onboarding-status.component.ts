import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-onboarding-status',
  templateUrl: './account-onboarding-status.component.html',
  styleUrls: ['./account-onboarding-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class AccountOnboardingStatusComponent implements OnInit {
  @Input() type: 'pending' | 'completed' | 'completing' = 'pending';
  @Input() showStatusOnly = false;

  router = inject(Router)
  constructor() { }
  ngOnInit() {
  }

}
