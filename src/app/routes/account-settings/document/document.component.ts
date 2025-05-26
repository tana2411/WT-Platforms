import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CompanyDocumentType } from 'app/models';
import { IDocument } from 'app/models/listing-material-detail.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
  imports: [MatIconModule, MatButtonModule, MatRadioModule, ReactiveFormsModule, FormsModule],
})
export class DocumentComponent implements OnInit {
  @Input() documents: IDocument[] | undefined = undefined;
  CompanyDocumentType = CompanyDocumentType;
  documentType: CompanyDocumentType = CompanyDocumentType.EnvironmentalPermit;
  selectedType: string = '';

  environmentPermitDocuments: IDocument[] = [];
  wasteExemptionDocuments: IDocument[] = [];
  wasteCarrierLicenseDocuments: IDocument[] = [];
  otherDocuments: IDocument[] = [];

  ngOnInit(): void {
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
}
