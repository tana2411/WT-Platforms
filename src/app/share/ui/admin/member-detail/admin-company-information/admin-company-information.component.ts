import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { MemberDetail } from 'app/models/admin/commercial.model';
import { getLocationAddress } from 'app/share/utils/offer';
import { OfferLocation } from 'app/types/requests/offer';

@Component({
  selector: 'app-admin-company-information',
  imports: [TitleCasePipe, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-company-information.component.html',
  styleUrl: './admin-company-information.component.scss',
})
export class AdminCompanyInformationComponent {
  company = input<MemberDetail['company']>();
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
