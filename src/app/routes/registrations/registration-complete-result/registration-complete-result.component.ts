import { Component, OnInit } from '@angular/core';
import { AccountOnboardingStatusComponent } from '@app/ui';

@Component({
  selector: 'app-registration-complete-result',
  templateUrl: './registration-complete-result.component.html',
  imports: [
    AccountOnboardingStatusComponent,
  ]
})
export class RegistrationCompleteResultComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
