import { Component, OnInit } from '@angular/core';
import { AccountOnboardingStatusComponent } from '@app/ui';

@Component({
  selector: 'app-registration-pending-result',
  templateUrl: './registration-pending-result.component.html',
  imports: [
    AccountOnboardingStatusComponent,
  ]
})
export class RegistrationPendingResultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
