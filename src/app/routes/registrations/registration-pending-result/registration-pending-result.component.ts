import { Component, OnInit } from '@angular/core';
import { AccountOnboardingStatusComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';

@Component({
  selector: 'app-registration-pending-result',
  templateUrl: './registration-pending-result.component.html',
  imports: [
    AccountOnboardingStatusComponent,
    UnAuthLayoutComponent
  ]
})
export class RegistrationPendingResultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
