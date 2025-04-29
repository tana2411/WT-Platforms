import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { AccountOnboardingStatusComponent } from "../../../share/ui/account-onboarding-status/account-onboarding-status.component";
import { MatIconModule } from '@angular/material/icon';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-information-section',
  templateUrl: './company-information-section.component.html',
  styleUrls: ['./company-information-section.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, AccountOnboardingStatusComponent, MatIconModule, MatRadioModule, ReactiveFormsModule]
})
export class CompanyInformationSectionComponent implements OnInit {
  formGroup = new FormGroup({
    companyType: new FormControl<string | null>(null, [Validators.required]),
    vatLocated: new FormControl<string | null>(null, [Validators.required]),
    streetAddress: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(100)]),
    postCode: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(20)]),
    city: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
    country: new FormControl<string | null>(null, [Validators.required]),
    countryRegion: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)]),
  })
  constructor() {
    this.formGroup.valueChanges.subscribe(() => {
      console.log(this.formGroup);
      
    })
   }

  ngOnInit() {
  }

  submit() {
    this.formGroup.markAllAsTouched()
  }

}
