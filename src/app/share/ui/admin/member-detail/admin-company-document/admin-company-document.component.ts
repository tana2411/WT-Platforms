import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyDocumentType } from 'app/models';
import { IDocument } from 'app/models/listing-material-detail.model';
import { AuthService } from 'app/services/auth.service';
import { getStatusColor } from 'app/share/utils/offer';
import { DocumentPreviewModalComponent } from '../admin-document-preview-modal/admin-document-preview-modal.component';

@Component({
  selector: 'app-admin-company-document',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    TitleCasePipe,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './admin-company-document.component.html',
  styleUrl: './admin-company-document.component.scss',
})
export class AdminCompanyDocumentComponent {
  user = input<{
    company: {
      companyDocuments: IDocument[];
    };
  }>({
    company: {
      companyDocuments: [
        {
          id: 448,
          uploadedByUserId: 3,
          reviewedByUserId: null,
          documentType: 'environmental_permit',
          documentName: 'Screenshot 2025-06-12 at 17.30.31.png',
          documentUrl:
            'https://wastetrade-resources-dev.s3.eu-west-2.amazonaws.com/1749724243402_Screenshot-2025-06-12-at-17.30.31.png',
          status: 'pending',
          rejectionReason: null,
          reviewedAt: null,
          expiryDate: null,
          createdAt: '2025-06-12T10:30:44.316Z',
          updatedAt: '2025-06-13T03:13:27.085Z',
          companyId: 2,
        },
        {
          id: 450,
          uploadedByUserId: 3,
          reviewedByUserId: null,
          documentType: 'environmental_permit',
          documentName: 'sample-local-pdf.pdf',
          documentUrl: 'https://wastetrade-resources-dev.s3.eu-west-2.amazonaws.com/1749784406382_sample-local-pdf.pdf',
          status: 'pending',
          rejectionReason: null,
          reviewedAt: null,
          expiryDate: null,
          createdAt: '2025-06-13T03:13:27.082Z',
          updatedAt: '2025-06-13T03:13:27.082Z',
          companyId: 2,
        },
      ] as any,
    },
  });

  documents = computed(() => this.user()?.company.companyDocuments);

  getStatusColor = getStatusColor;
  documentTypeUploaded: string = '';
  // documents: IDocument[] | undefined = undefined;
  CompanyDocumentType = CompanyDocumentType;
  documentType: CompanyDocumentType = CompanyDocumentType.EnvironmentalPermit;

  environmentPermitDocuments: IDocument[] = [];
  wasteExemptionDocuments: IDocument[] = [];
  wasteCarrierLicenseDocuments: IDocument[] = [];
  otherDocuments: IDocument[] = [];

  authService = inject(AuthService);
  dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      const document = this.documents();
      if (document.length > 0) {
        this.documentTypeUploaded = [
          ...new Set(
            document
              .filter((d) => d.documentType != 'waste_carrier_license')
              .map((d) =>
                d.documentType
                  .split('_')
                  .map((token) => token.at(0)?.toUpperCase() + token.slice(1))
                  .join(' '),
              ),
          ),
        ].join(', ');
        this.showDocuments();
      }
    });
  }

  private showDocuments() {
    if (this.documents()) {
      this.resetDocument();
      this.documents().forEach((document) => {
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
    }
  }

  resetDocument() {
    this.environmentPermitDocuments = [];
    this.wasteCarrierLicenseDocuments = [];
    this.wasteExemptionDocuments = [];
    this.otherDocuments = [];
  }

  extractFileName(url: string): string {
    return url.split('/').pop() || '';
  }

  viewDocument(item: IDocument) {
    this.dialog.open(DocumentPreviewModalComponent, {
      data: { url: item.documentUrl },
      width: '960px',
      maxWidth: '95vw',
    });
  }
}
