import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { Company } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { EditCompanyInformationFormComponent } from './edit-company-information-form/edit-company-information-form.component';
import { EditSocialUrlFormComponent } from './edit-social-url-form/edit-social-url-form.component';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  imports: [MatIconModule, MatButtonModule, TitleCasePipe],
})
export class InfoComponent {
  mapCountryCodeToName = mapCountryCodeToName;

  @Input() company: Company | undefined;

  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  openEditCompanyInfo() {
    const dataConfig: MatDialogConfig = {
      data: { companyInfo: this.company, width: '600px' },
    };
    const dialogRef = this.dialog.open(EditCompanyInformationFormComponent, dataConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.checkToken().subscribe();
      }
    });
  }

  openEditSocialUrl() {
    const { facebookUrl, instagramUrl, linkedinUrl, xUrl } = this.company || {};
    const dataConfig: MatDialogConfig = {
      data: {
        urlInfo: { facebookUrl, instagramUrl, linkedinUrl, xUrl },
        companyId: this.company?.id,
      },
    };
    const dialogRef = this.dialog.open(EditSocialUrlFormComponent, dataConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.checkToken().subscribe();
      }
    });
  }

  countryCodeToName(code: string | undefined): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }
}
