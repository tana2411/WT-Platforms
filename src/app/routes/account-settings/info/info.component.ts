import { TitleCasePipe } from '@angular/common';
import { Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mapCountryCodeToName } from '@app/statics';
import { Company, User } from 'app/models';
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
  user: Signal<User | null | undefined>;

  company: Company | undefined = undefined;

  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor() {
    this.user = toSignal(this.authService.user$);
    if (this.user()) {
      this.company = this.user()?.company;
    }

    effect(() => {
      if (this.user()) {
        this.company = this.user()?.company;
      }
    });
  }

  openEditCompanyInfo() {
    const dataConfig: MatDialogConfig = {
      data: { companyInfo: this.company },
      width: '100%',
      maxWidth: '960px',
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
      width: '100%',
      maxWidth: '960px',
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
