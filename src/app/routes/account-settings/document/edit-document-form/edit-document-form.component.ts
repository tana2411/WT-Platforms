import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DocumentFileInfo, FileInfo, FileUploadComponent } from '@app/ui';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { CompanyDocument, CompanyDocumentType } from 'app/models';

@Component({
  selector: 'app-edit-document-form',
  templateUrl: './edit-document-form.component.html',
  styleUrls: ['./edit-document-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    IconComponent,
    MatButtonModule,
    MatSnackBarModule,
    MatOptionModule,
    MatDialogModule,
    MatIconModule,
    MatRadioModule,
    FileUploadComponent,
  ],
})
export class EditDocumentFormComponent implements OnInit {
  formGroup = new FormGroup({
    documentType: new FormControl<string | null>(null, [Validators.required]),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    otherDocumentType: new FormControl<string | null>(null),
  });
  CompanyDocumentType = CompanyDocumentType;
  companyDocuments: CompanyDocument[] = [];
  environmentPermitDocuments: DocumentFileInfo[] = [];
  wasteExemptionDocuments: DocumentFileInfo[] = [];
  wasteCarrierLicenseDocuments: DocumentFileInfo[] = [];
  otherDocuments: DocumentFileInfo[] = [];

  submitting = signal<boolean>(false);
  selectedDocumentFile = signal<any[]>([]);
  selectedWasteLicenceFile = signal<any[]>([]);
  documentValid = signal<boolean | null>(null);
  wasteLicenceValid = signal<boolean | null>(null);

  readonly dialogRef = inject(MatDialogRef<{ [key: string]: string }>);
  readonly data = inject<{ documents: CompanyDocument[] }>(MAT_DIALOG_DATA);
  cd = inject(ChangeDetectorRef);

  get documentType() {
    return this.formGroup.get('documentType') as FormControl;
  }

  constructor() {}

  ngOnInit() {
    if (this.data?.documents?.length > 0) {
      this.companyDocuments = this.data.documents;
      this.showDocument(this.companyDocuments);
    }
  }

  ngAfterViewInit() {
    if (this.data?.documents?.length > 0) {
      this.chooseDocumentType(this.data.documents);
      this.cd.detectChanges();
    }
  }

  private showDocument(documents: CompanyDocument[]) {
    this.environmentPermitDocuments = this.getDocumentList(documents, CompanyDocumentType.EnvironmentalPermit);
    this.wasteExemptionDocuments = this.getDocumentList(documents, CompanyDocumentType.WasteExemption);
    this.wasteCarrierLicenseDocuments = this.getDocumentList(documents, CompanyDocumentType.WasteCarrierLicense);
    this.otherDocuments = this.getDocumentList(documents, 'other');
  }

  private getDocumentList(documents: CompanyDocument[], type: string): DocumentFileInfo[] {
    if (!documents) return [];

    if (type === 'other') {
      return documents
        .filter(
          (d) =>
            d.documentType !== CompanyDocumentType.EnvironmentalPermit &&
            d.documentType !== CompanyDocumentType.WasteExemption &&
            d.documentType !== CompanyDocumentType.WasteCarrierLicense,
        )
        .map((d) => ({
          documentUrl: d.documentUrl,
          expiryDate: d.expiryDate,
          documentType: d.documentType,
        }));
    }

    return documents
      .filter((d) => d.documentType === type)
      .map((d) => ({
        documentUrl: d.documentUrl,
        expiryDate: d.expiryDate,
        documentType: d.documentType,
      }));
  }

  private chooseDocumentType(documents: CompanyDocument[]) {
    if (this.wasteCarrierLicenseDocuments.length > 0) {
      this.formGroup.patchValue({ wasteLicence: true }, { emitEvent: false });
    } else {
      this.formGroup.patchValue({ wasteLicence: false }, { emitEvent: false });
    }

    if (this.otherDocuments.length > 0) {
      this.formGroup.patchValue(
        {
          documentType: 'other',
          otherDocumentType: this.otherDocuments[0].documentType,
        },
        { emitEvent: false },
      );
    } else if (this.environmentPermitDocuments.length > 0) {
      this.formGroup.patchValue(
        {
          documentType: CompanyDocumentType.EnvironmentalPermit,
        },
        { emitEvent: false },
      );
    } else if (this.wasteExemptionDocuments.length > 0) {
      this.formGroup.patchValue(
        {
          documentType: CompanyDocumentType.WasteExemption,
        },
        { emitEvent: false },
      );
    }
  }

  handleFileReady(file: FileInfo[] | null, type: 'document' | 'licence', documentType: string) {
    if (type === 'document') {
      if (file && file.length > 0) {
        this.selectedDocumentFile.set([
          ...this.selectedDocumentFile().filter((f) => f.documentType !== documentType),
          ...file.map((f) => ({ ...f, documentType })),
        ]);
      } else {
        this.selectedDocumentFile.set(this.selectedDocumentFile().filter((f) => f.documentType !== documentType));
      }
    } else {
      this.selectedWasteLicenceFile.set(file ?? []);
    }
    this.formGroup.updateValueAndValidity();
  }

  get isSubmitDisabled() {
    if (this.formGroup.invalid || this.formGroup.pristine) {
      return true;
    } else {
      const exitsFile = this.selectedDocumentFile().filter((f) => f.documentType == this.documentType.value);
      const { documentType, wasteLicence } = this.formGroup.value;
      const validDocument = documentType !== 'uploadLater' ? exitsFile.length > 0 : true;
      const validLicence = wasteLicence ? this.selectedWasteLicenceFile().length > 0 : true;

      return !(validDocument && validLicence);
    }
  }

  submit() {}
}
