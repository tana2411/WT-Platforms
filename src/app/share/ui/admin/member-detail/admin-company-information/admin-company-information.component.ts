import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { getLocationAddress } from 'app/share/utils/offer';
import { OfferLocation } from 'app/types/requests/offer';

@Component({
  selector: 'app-admin-company-information',
  imports: [TitleCasePipe, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-company-information.component.html',
  styleUrl: './admin-company-information.component.scss',
})
export class AdminCompanyInformationComponent {
  company = input<any>({
    name: 'Acme Waste Solutions',
    website: 'https://acmewaste.com',
    companyInterest: 'Recycling',
    companyType: 'Corporation',
    vatNumber: 'VAT123456789',
    registrationNumber: 'REG987654321',
    description: 'Leading provider of sustainable waste management solutions.',
    addressLine1: '123 Green Street',
    postalCode: '12345',
    city: 'Eco City',
    stateProvince: 'Green State',
    country: 'US', // Use country code as expected by countryCodeToName()
    email: 'info@acmewaste.com',
    phoneNumber: '+1-555-123-4567',
    facebookUrl: 'https://facebook.com/acmewaste',
    instagramUrl: 'https://instagram.com/acmewaste',
    linkedinUrl: 'https://linkedin.com/company/acmewaste',
    xUrl: 'acmewaste', // X (Twitter) username without @
  });
  mapCountryCodeToName = mapCountryCodeToName;

  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  countryCodeToName(code: string | undefined): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }

  location = computed(() => {
    return getLocationAddress(this.company() as OfferLocation);
  });

  // openEditCompanyInfo() {
  //   const dataConfig: MatDialogConfig = {
  //     data: { companyInfo: this.company },
  //     width: '100%',
  //     maxWidth: '960px',
  //   };
  //   const dialogRef = this.dialog.open(EditCompanyInformationFormComponent, dataConfig);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // todo: Reload data
  //       // this.authService.checkToken().subscribe();
  //     }
  //   });
  // }

  // openEditSocialUrl() {
  //   const company = this.company();
  //   if (!company) {
  //     return;
  //   }

  //   const { facebookUrl, instagramUrl, linkedinUrl, xUrl, id } = company;
  //   const dataConfig: MatDialogConfig = {
  //     data: {
  //       urlInfo: { facebookUrl, instagramUrl, linkedinUrl, xUrl },
  //       companyId: id,
  //     },
  //     width: '100%',
  //     maxWidth: '960px',
  //   };
  //   const dialogRef = this.dialog.open(EditSocialUrlFormComponent, dataConfig);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // todo: Reload data
  //       // this.authService.checkToken().subscribe();
  //     }
  //   });
  // }
}
