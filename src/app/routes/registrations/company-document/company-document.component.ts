import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AccountOnboardingStatusComponent, FileInfo, FileUploadComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';
import { RegistrationsService } from 'app/services/registrations.service';
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
  providers: [provideNativeDateAdapter()],
})
export class CompanyDocumentComponent implements OnInit {
  companyId: number | undefined;

  selectedDocumentFile = signal<any[]>([]);
  selectedWasteLicenceFile = signal<FileInfo[]>([]);
  documentValid = signal<boolean | null>(null);
  wasteLicenceValid = signal<boolean | null>(null);
  onSelectUploadLater = signal<boolean | null>(null);
  submitting = signal<boolean>(false);

  formGroup = new FormGroup({
    companyType: new FormControl<string | null>(null, [Validators.required]),
    documentType: new FormControl<string | null>(null, [Validators.required]),
    // otherDocumentType: new FormControl<string | null>(null),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    boxClearingAgent: new FormControl<boolean | null>(null, Validators.required),
  });

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  registrationService = inject(RegistrationsService);
  router = inject(Router);

  constructor() {}

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
        if (user) {
          this.formGroup.patchValue({
            companyType: user.company?.companyType ?? '',
          });

          this.companyId = user.company?.id;
        }
      });
  }

  get documentType() {
    return this.formGroup.get('documentType') as FormControl;
  }

  get isSubmitDisabled() {
    if (this.formGroup.invalid) {
      return true;
    } else {
      const { documentType, wasteLicence } = this.formGroup.value;
      const validDocument = documentType !== 'uploadLater' ? this.selectedDocumentFile().length > 0 : true;
      const validLicence = wasteLicence ? this.selectedWasteLicenceFile().length > 0 : true;

      return !(validDocument && validLicence);
    }
  }

  onSelectDocumentType(item: string) {
    this.formGroup.get('documentType')?.setValue(item);
  }

  handleFileReady(file: FileInfo[], type: 'document' | 'licence', documentType: string) {
    if (file) {
      if (type === 'document') {
        this.selectedDocumentFile.set([
          ...this.selectedDocumentFile().filter((f) => f.documentType != documentType),
          ...file.map((f) => ({ ...f, documentType: documentType })),
        ]);
      } else {
        this.selectedWasteLicenceFile.set(file);
      }
    }
    this.formGroup.updateValueAndValidity();
  }

  onLicenceChange(event: MatRadioChange) {
    this.selectedWasteLicenceFile.set([]);
  }

  send() {
    this.formGroup.markAllAsTouched();
    const { boxClearingAgent } = this.formGroup.value;

    const fileUpload = [
      ...this.selectedDocumentFile(),
      ...this.selectedWasteLicenceFile().map((f) => ({ ...f, documentType: 'waste_carrier_license' })),
    ];

    this.submitting.set(true);
    this.registrationService
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
          if (!documentUrls) {
            return of(null);
          }
          const payload: any = {
            companyId: this.companyId,
            documents: documentUrls.map((url, index) => {
              let expirationDate = null;

              if (fileUpload[index].expirationDate) {
                if (moment.isMoment(fileUpload[index].expirationDate)) {
                  expirationDate = fileUpload[index].expirationDate.format('DD/MM/YYYY');
                } else {
                  expirationDate = moment(fileUpload[index].expirationDate).format('DD/MM/YYYY');
                }
              }

              return {
                documentType: fileUpload[index].documentType,
                documentUrl: url,
                expiryDate: expirationDate,
              };
            }),
            boxClearingAgent,
          };

          return this.registrationService.updateCompanyDocuments(payload).pipe(
            finalize(() => {
              this.submitting.set(false);
            }),
            catchError((err) => {
              this.snackBar.open(`${err.error.error.message}`, 'Ok', {
                duration: 3000,
              });
              return of(null);
            }),
          );
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/site-location']);
        }
      });
  }
}
