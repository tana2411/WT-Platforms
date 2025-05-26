import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AccountOnboardingStatusComponent, DocumentFileInfo, FileInfo, FileUploadComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { CompanyDocument, CompanyDocumentType } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { RegistrationsService } from 'app/services/registrations.service';
import { UploadService } from 'app/share/services/upload.service';
import moment from 'moment';
import { catchError, concatMap, filter, finalize, of, take } from 'rxjs';

@Component({
  selector: 'app-company-document',
  templateUrl: './company-document.component.html',
  styleUrls: ['./company-document.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AccountOnboardingStatusComponent,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    ReactiveFormsModule,
    UnAuthLayoutComponent,
    MatCheckboxModule,
    FileUploadComponent,
    MatDatepickerModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDocumentComponent implements OnInit {
  CompanyDocumentType = CompanyDocumentType;

  companyId: number | undefined;
  companyDocuments: CompanyDocument[] = [];
  environmentPermitDocuments: DocumentFileInfo[] = [];
  wasteExemptionDocuments: DocumentFileInfo[] = [];
  wasteCarrierLicenseDocuments: DocumentFileInfo[] = [];
  otherDocuments: DocumentFileInfo[] = [];

  selectedDocumentFile = signal<any[]>([]);
  selectedWasteLicenceFile = signal<any[]>([]);
  documentValid = signal<boolean | null>(null);
  wasteLicenceValid = signal<boolean | null>(null);
  onSelectUploadLater = signal<boolean | null>(null);
  submitting = signal<boolean>(false);

  formGroup = new FormGroup({
    companyType: new FormControl<string | null>({ value: null, disabled: true }),
    documentType: new FormControl<string | null>(null, [Validators.required]),
    otherDocumentType: new FormControl<string | null>(null),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    boxClearingAgent: new FormControl<boolean | null>(null, Validators.required),
  });

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  registrationService = inject(RegistrationsService);
  router = inject(Router);
  cd = inject(ChangeDetectorRef);
  uploadService = inject(UploadService);

  constructor() {
    effect(() => {
      const otherFile = this.selectedDocumentFile().find((f) => f.documentType == 'other');
      if (otherFile) {
        this.formGroup.get('otherDocumentType')?.setValidators(Validators.required);
      } else {
        this.formGroup.get('otherDocumentType')?.clearValidators();
      }
      this.formGroup.get('otherDocumentType')?.updateValueAndValidity();
      this.formGroup.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.authService.user$
      .pipe(
        filter((user) => !!user),
        take(1),
        catchError((err) => {
          if (err) {
            this.snackBar.open(
              'An error occurred while retrieving your information. Please refresh the page or contact support if the problem persists.',
              'Ok',
              { duration: 3000 },
            );
          }
          return of(null);
        }),
      )
      .subscribe((user) => {
        if (!user) return;
        this.companyId = user.company?.id;
        this.companyDocuments = user.company.companyDocuments;

        this.formGroup.patchValue(
          {
            boxClearingAgent: user.company.boxClearingAgent,
            companyType: user.company.companyType,
          },
          { emitEvent: false },
        );

        this.environmentPermitDocuments = this.getDocumentList(
          this.companyDocuments,
          CompanyDocumentType.EnvironmentalPermit,
        );
        this.wasteExemptionDocuments = this.getDocumentList(this.companyDocuments, CompanyDocumentType.WasteExemption);
        this.wasteCarrierLicenseDocuments = this.getDocumentList(
          this.companyDocuments,
          CompanyDocumentType.WasteCarrierLicense,
        );
        this.otherDocuments = this.getDocumentList(this.companyDocuments, 'other');

        if (this.wasteCarrierLicenseDocuments.length) {
          this.formGroup.patchValue({ wasteLicence: true }, { emitEvent: false });
        } else {
          this.formGroup.patchValue({ wasteLicence: false }, { emitEvent: false });
        }

        if (this.otherDocuments.length) {
          this.formGroup.patchValue(
            { documentType: 'other', otherDocumentType: this.otherDocuments[0].documentType },
            { emitEvent: false },
          );
        }
        if (this.environmentPermitDocuments.length) {
          this.formGroup.patchValue(
            {
              documentType: 'environmental_permit',
            },
            { emitEvent: false },
          );
        }
        if (this.wasteExemptionDocuments.length) {
          this.formGroup.patchValue(
            {
              documentType: 'waste_exemption',
            },
            { emitEvent: false },
          );
        }
      });
  }

  getDocumentList(documents: CompanyDocument[], type: string): DocumentFileInfo[] {
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

  get documentType() {
    return this.formGroup.get('documentType') as FormControl;
  }

  get otherDocumentType() {
    return this.formGroup.get('otherDocumentType') as FormControl;
  }

  get isSubmitDisabled() {
    if (this.formGroup.invalid) {
      return true;
    } else {
      const exitsFile = this.selectedDocumentFile().filter((f) => f.documentType == this.documentType.value);
      const { documentType, wasteLicence } = this.formGroup.value;
      const validDocument = documentType !== 'uploadLater' ? exitsFile.length > 0 : true;
      const validLicence = wasteLicence ? this.selectedWasteLicenceFile().length > 0 : true;

      return !(validDocument && validLicence);
    }
  }

  onSelectDocumentType(item: string) {
    this.formGroup.get('documentType')?.setValue(item);
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

  onLicenceChange(event: MatRadioChange) {
    this.selectedWasteLicenceFile.set([]);
  }

  send() {
    this.formGroup.markAllAsTouched();
    const { boxClearingAgent, wasteLicence } = this.formGroup.value;

    const isUploadLater = this.documentType.value === 'uploadLater';
    const hasWasteLicence = wasteLicence;

    const documentFiles = this.selectedDocumentFile().map((f) =>
      f.documentType == 'other' ? { ...f, documentType: this.otherDocumentType.value } : f,
    );
    const licenceFiles = this.selectedWasteLicenceFile().map((f) => ({
      ...f,
      documentType: CompanyDocumentType.WasteCarrierLicense,
    }));

    const files = [...documentFiles, ...licenceFiles];

    if (isUploadLater && !hasWasteLicence) {
      this.submitWithNoFile({ companyId: this.companyId, boxClearingAgent, documents: [] });
      return;
    }

    const fileUpload = files.filter((f) => f.file instanceof File);
    const alreadyUpload = files
      .filter((f) => !f.file)
      .map((file) => {
        if (file.expiryDate) {
          return {
            documentType: file.documentType,
            documentUrl: file.documentUrl,
            expiryDate: moment(file.expiryDate).format('DD/MM/YYYY'),
          };
        }

        return {
          documentType: file.documentType,
          documentUrl: file.documentUrl,
        };
      });

    this.submitting.set(true);

    if (fileUpload.length > 0) {
      this.uploadService
        .uploadMultiFile(fileUpload.map((f) => f.file))
        .pipe(
          finalize(() => this.submitting.set(false)),
          catchError((err) => {
            this.snackBar.open('An error occurred while uploading the file. Please try again.', 'Ok', {
              duration: 3000,
            });
            return of(null);
          }),
          concatMap((documentUrls) => {
            if (!documentUrls) return of(null);

            const documents = documentUrls.map((url, index) => {
              const file = fileUpload[index];
              if (file.expiryDate) {
                return {
                  documentType: file.documentType,
                  documentUrl: url,
                  expiryDate: moment(file.expiryDate).format('DD/MM/YYYY'),
                };
              }

              return {
                documentType: file.documentType,
                documentUrl: url,
              };
            });

            return this.submitWithDocument([...documents, ...alreadyUpload], boxClearingAgent);
          }),
        )
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['/site-location']);
          }
        });
    } else {
      this.submitWithDocument(alreadyUpload, boxClearingAgent).subscribe((result) => {
        if (result) {
          this.router.navigate(['/site-location']);
        }
      });
    }
  }

  private submitWithDocument(documents: any[], boxClearingAgent: boolean | null | undefined) {
    return this.registrationService
      .updateCompanyDocuments({
        companyId: this.companyId,
        boxClearingAgent,
        documents: [...documents],
      })
      .pipe(
        finalize(() => this.submitting.set(false)),
        catchError((err) => {
          this.snackBar.open(`${err.error?.error?.message ?? 'Unknown error'}`, 'Ok', { duration: 3000 });
          return of(null);
        }),
        concatMap((result) => {
          if (result) return this.authService.checkToken();
          return of(null);
        }),
      );
  }

  private submitWithNoFile(payload: any) {
    this.submitting.set(true);
    this.registrationService
      .updateCompanyDocuments(payload)
      .pipe(
        finalize(() => this.submitting.set(false)),
        catchError((err) => {
          this.snackBar.open(`${err.error?.error?.message ?? 'Unknown error'}`, 'Ok', {
            duration: 3000,
          });
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/site-location']);
        }
      });
  }
}
