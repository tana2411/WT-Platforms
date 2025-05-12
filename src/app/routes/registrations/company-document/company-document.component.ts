import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AccountOnboardingStatusComponent, FileInfo, FileUploadComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';
import { AuthService } from 'app/services/auth.service';
import { catchError, filter, of, take } from 'rxjs';

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
  selectedDocumentFile = signal<FileInfo[]>([]);
  selectedWasteLicenceFile = signal<FileInfo[]>([]);
  documentValid = signal<boolean | null>(null);
  wasteLicenceValid = signal<boolean | null>(null);

  onSelectUploadLater = signal<boolean | null>(null);
  formGroup = new FormGroup({
    companyType: new FormControl<string | null>(null, [Validators.required]),
    documentType: new FormControl<string | null>(null, [Validators.required]),
    otherDocumentType: new FormControl<string | null>(null),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    boxClearingAgent: new FormControl<boolean | null>(null, Validators.required),
  });

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { documentType } = value;
      if (!this.onSelectUploadLater() && documentType == 'other') {
        this.formGroup.get('otherDocumentType')?.setValidators(Validators.required);
      } else {
        this.formGroup.get('otherDocumentType')?.clearValidators();
      }
      this.formGroup.get('otherDocumentType')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      this.formGroup.updateValueAndValidity({ emitEvent: false });
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
        if (user) {
          this.formGroup.patchValue({
            companyType: user.company?.companyType ?? '',
          });

          // this.companyId = user.company?.id;
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

  handleFileReady(file: FileInfo[], type: 'document' | 'licence') {
    if (file) {
      if (type === 'document') {
        this.selectedDocumentFile.set(file);
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
    const { ...value } = this.formGroup.value;
    console.log(this.selectedDocumentFile());
    console.log(this.selectedWasteLicenceFile());
    console.log(this.formGroup);
  }
}
