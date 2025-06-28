import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { MemberDetail } from 'app/models/admin/commercial.model';

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
    const location = this.company() ?? ({} as any);
    const data = [
      location.addressLine1,
      location.city,
      location.country ? mapCountryCodeToName[location.country] : undefined,
    ].filter((i) => !!i);
    return data.join(', ');
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
