import { Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CompanyDocumentType, User } from 'app/models';
import { IDocument } from 'app/models/listing-material-detail.model';
import { AuthService } from 'app/services/auth.service';
import { EditDocumentFormComponent } from './edit-document-form/edit-document-form.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
  imports: [MatIconModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, FormsModule],
})
export class DocumentComponent {
  user: Signal<User | null | undefined>;

  documents: IDocument[] | undefined = undefined;
  CompanyDocumentType = CompanyDocumentType;
  documentType: CompanyDocumentType = CompanyDocumentType.EnvironmentalPermit;
  selectedType: string = '';

  environmentPermitDocuments: IDocument[] = [];
  wasteExemptionDocuments: IDocument[] = [];
  wasteCarrierLicenseDocuments: IDocument[] = [];
  otherDocuments: IDocument[] = [];

  authService = inject(AuthService);
  dialog = inject(MatDialog);

  constructor() {
    this.user = toSignal(this.authService.user$);

    effect(() => {
      if (this.user()?.company.companyDocuments) {
        this.documents = this.user()?.company.companyDocuments;
        this.showDocuments();
      }
    });
  }

  private showDocuments() {
    if (this.documents) {
      this.documents.forEach((document) => {
        switch (document.documentType) {
          case CompanyDocumentType.EnvironmentalPermit:
            this.environmentPermitDocuments.push(document);
            break;
          case CompanyDocumentType.WasteExemption:
            this.wasteExemptionDocuments.push(document);
            break;
          case CompanyDocumentType.WasteCarrierLicense:
            this.wasteCarrierLicenseDocuments.push(document);
            break;
          default:
            this.otherDocuments.push(document);
        }
      });

      this.chooseSelectedType();
    }
  }

  private chooseSelectedType() {
    if (this.environmentPermitDocuments.length > 0) {
      this.selectedType = CompanyDocumentType.EnvironmentalPermit;
    } else if (this.wasteCarrierLicenseDocuments.length > 0) {
      this.selectedType = CompanyDocumentType.WasteCarrierLicense;
    } else if (this.otherDocuments.length > 0) {
      this.selectedType = 'other';
    } else {
      this.selectedType = '';
    }
  }

  extractFileName(url: string): string {
    return url.split('/').pop() || '';
  }

  openEditDocuments() {
    const dataConfig: MatDialogConfig = {
      data: { documents: this.documents },
      width: '100%',
      maxWidth: '960px',
    };
    const dialogRef = this.dialog.open(EditDocumentFormComponent, dataConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.checkToken().subscribe((value) => {
          if (value) {
            this.showDocuments();
          }
        });
      }
    });
  }
}
