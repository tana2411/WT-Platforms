import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AccountOnboardingStatusComponent, FileUploadComponent } from '@app/ui';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class CompanyDocumentComponent implements OnInit {
  selectedDocumentFile = signal<File[]>([]);
  selectedWasteLicenceFile = signal<File[]>([]);
  documentFileError = signal<string | null>(null);
  wasteLicenceError = signal<string | null>(null);

  onSelectUploadLater = signal<boolean | null>(null);
  formGroup = new FormGroup({
    documentType: new FormControl<string | null>(null, [Validators.required]),
    expiryDocument: new FormControl<Date | null>(null, [Validators.required]),
    wasteLicence: new FormControl<boolean | null>(null, [Validators.required]),
    expiryLicence: new FormControl<Date | null>(null),
    boxClearingAgent: new FormControl<boolean | null>(
      null,
      Validators.required,
    ),
  });

  constructor() {
    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const { documentType, wasteLicence } = value;
        if (documentType !== 'uploadFile') {
          this.formGroup
            .get('expiryDocument')
            ?.setValidators(Validators.required);
        }
        wasteLicence
          ? this.formGroup
              .get('expiryLicence')
              ?.setValidators(Validators.required)
          : this.formGroup.get('expiryLicence')?.clearValidators();
      });
  }

  ngOnInit() {}

  get documentType() {
    return this.formGroup.get('documentType') as FormControl;
  }

  get isSubmitDisabled() {
    if (this.formGroup.invalid) {
      return true;
    } else {
      const { documentType, wasteLicence } = this.formGroup.value;
      const validDocument =
        documentType !== 'uploadLater'
          ? this.selectedDocumentFile().length > 0
          : true;
      const validLicence = wasteLicence
        ? this.selectedWasteLicenceFile().length > 0
        : true;

      return !(validDocument && validLicence);
    }
  }

  onSelectDocumentType(item: string) {
    this.formGroup.get('documentType')?.setValue(item);
  }

  handleFileReady(file: any[] | null, type: 'document' | 'licence') {
    if (file?.length) {
      if (type === 'document') {
        this.documentFileError.set(null);
        this.selectedDocumentFile.set(file);
      } else {
        this.wasteLicenceError.set(null);
        this.selectedWasteLicenceFile.set(file);
      }
    }
    this.formGroup.updateValueAndValidity();
  }

  send() {
    this.formGroup.markAllAsTouched();
    const { ...value } = this.formGroup.value;
    console.log(this.selectedDocumentFile());
    console.log(this.selectedWasteLicenceFile());
    console.log(this.formGroup);
  }
}
