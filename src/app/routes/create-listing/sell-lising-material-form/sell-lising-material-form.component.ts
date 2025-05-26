import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { colour, countries, finishing, materialTypes, packing } from '@app/statics';
import { FileInfo, FileUploadComponent } from '@app/ui';
import { noForbiddenPatternsValidator, pastDateValidator } from '@app/validators';
import { AuthService } from 'app/services/auth.service';
import { ListingService } from 'app/services/listing.service';
import { UploadService } from 'app/share/services/upload.service';
import { catchError, concatMap, filter, finalize, of, take } from 'rxjs';

const OTHER_LOCATION = '__OTHER_LOCATION';

@Component({
  selector: 'app-sell-lising-material-form',
  imports: [
    MatIconModule,
    FileUploadComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './sell-lising-material-form.component.html',
  styleUrl: './sell-lising-material-form.component.scss',
})
export class SellLisingMaterialFormComponent {
  countryOption = countries;
  materialTypes = materialTypes;
  colourOption = colour;
  finishingOption = finishing;
  packingOption = packing;
  companyId: number | undefined;
  today = new Date();
  OTHER_LOCATION = OTHER_LOCATION;

  maxFileSize = 5 * 1024 * 1024; // 5mb

  cd = inject(ChangeDetectorRef);
  uploadService = inject(UploadService);
  snackBar = inject(MatSnackBar);
  listingService = inject(ListingService);
  authService = inject(AuthService);
  router = inject(Router);

  // onGoingListing = signal<boolean | undefined>(undefined);
  // hasSpecialData = signal<boolean | undefined>(false);
  itemOption = signal<{ code: string; name: string }[]>([]);
  formOption = signal<{ code: string; name: string }[]>([]);
  gradingOption = signal<{ code: string; name: string }[]>([]);
  selectedFile = signal<FileInfo[]>([]);
  additionalInformationLength = signal<number>(0);
  submitting = signal<boolean>(false);
  locations = toSignal(this.authService.companyLocations$, { initialValue: [] });

  formGroup = new FormGroup({
    country: new FormControl<string | null>(null, [Validators.required]),

    hasSpecialData: new FormControl<string | null>('false', [Validators.required]),

    materialType: new FormControl<string | null>(null, [Validators.required]),
    materialItem: new FormControl<string | null>(null, [Validators.required]),
    materialForm: new FormControl<string | null>(null, [Validators.required]),
    materialGrading: new FormControl<string | null>(null, [Validators.required]),
    materialColor: new FormControl<string | null>(null, [Validators.required]),
    materialFinishing: new FormControl<string | null>(null, [Validators.required]),
    materialPacking: new FormControl<string | null>(null, [Validators.required]),
    remainInCountry: new FormControl<string | null>('false', [Validators.required]),
    // capacityPerMonth: new FormControl<string | null>(null, [Validators.required, Validators.min(1)]),
    // materialFlowIndex: new FormControl<string | null>(null, [Validators.required]),
    wasteStoration: new FormControl<string | null>(null, [Validators.required]),
    weightUnit: new FormControl<string | null>(null, [Validators.required]),
    materialWeight: new FormControl<number | null>(null, [Validators.required]),
    quantity: new FormControl<number | null>(null, [Validators.required]),

    currency: new FormControl<string | null>(null, [Validators.required]),
    pricePerMetric: new FormControl<string | null>(null, [Validators.required]),

    startDate: new FormControl<Date | null>(null, [Validators.required, pastDateValidator()]),

    ongoingListing: new FormControl<string | null>('false', [Validators.required]),
    listingRenewalPeriod: new FormControl<string | null>(null, [Validators.required]),
    listingDuration: new FormControl<Date | null>(null),

    additionalNotes: new FormControl<string | null>(null, [
      Validators.maxLength(32000),
      noForbiddenPatternsValidator(),
    ]),
  });

  constructor() {
    this.today.setDate(this.today.getDate() - 0);
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { materialType, additionalNotes } = value;
      if (materialType) {
        const selectedMateriaType = materialTypes.find((m) => m.code == materialType);
        if (selectedMateriaType) {
          this.itemOption.set(selectedMateriaType?.materials);
          this.formOption.set(selectedMateriaType?.form);
          this.gradingOption.set(selectedMateriaType?.grading);
        }
      }
      if (additionalNotes) {
        this.additionalInformationLength.set(additionalNotes?.length);
      }
    });

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 30);

    this.formGroup.patchValue({ listingDuration: futureDate }, { emitEvent: false });

    // this.formGroup.controls.country.valueChanges
    //   .pipe(
    //     filter((v) => !v),
    //     takeUntilDestroyed(),
    //     tap(() => {
    //       const disableControlNames = Object.keys(this.formGroup.controls);
    //       console.log({ disableControlNames });
    //     }),
    //   )
    //   .subscribe();

    const disableControlNames = Object.keys(this.formGroup.controls).filter((i) => i !== 'country');
    console.log({ disableControlNames });
    disableControlNames.forEach((key) => {
      ((this.formGroup.controls as any)[key] as FormControl).disable();
    });

    effect(() => {
      const { materialForm, materialGrading, materialItem, country } = this.formGroup.controls;

      if (this.formOption().length > 0) {
        materialForm.setValidators(Validators.required);
      } else {
        materialForm.clearValidators();
        materialForm.setValue('N/A', { emitEvent: false });
      }

      if (this.gradingOption().length > 0) {
        materialGrading.setValidators(Validators.required);
      } else {
        materialGrading.clearValidators();
        materialGrading.setValue('N/A', { emitEvent: false });
      }

      if (this.itemOption().length > 0) {
        materialItem.setValidators(Validators.required);
      } else {
        materialItem.clearValidators();
      }

      materialItem.updateValueAndValidity();
      materialForm.updateValueAndValidity();
      materialGrading.updateValueAndValidity();
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
        if (user) {
          this.companyId = user.company?.id;
        }
      });
  }

  handleFileReady(file: FileInfo[]) {
    if (file) {
      this.selectedFile.set(file);
    }
  }

  ongoingListingChange(event: MatRadioChange) {
    const { listingDuration, listingRenewalPeriod } = this.formGroup.controls;
    listingDuration.markAsUntouched();
    listingRenewalPeriod.markAsUntouched();
    if (event.value == 'true') {
      listingDuration.clearValidators();
      listingRenewalPeriod.setValidators(Validators.required);
    } else {
      listingDuration.setValidators([Validators.required, pastDateValidator()]);
      listingRenewalPeriod.clearValidators();
    }

    listingDuration.updateValueAndValidity();
    listingRenewalPeriod.updateValueAndValidity();
  }

  send() {
    if (this.formGroup.invalid) return;
    let { weightUnit, ongoingListing, ...value } = this.formGroup.value;

    const payload: any = {
      ...value,
      listingType: 'wanted',
      companyId: this.companyId,
      startDate: value.startDate?.toISOString(),
    };

    if (!this.itemOption().length) {
      delete payload.materialItem;
    }

    if (!this.formOption().length) {
      delete payload.materialForm;
    }

    if (!this.gradingOption().length) {
      delete payload.materialGrading;
    }

    ongoingListing == 'true' ? delete payload.listingDuration : delete payload.listingRenewalPeriod;

    this.submitting.set(true);

    this.uploadService
      .uploadMultiFile(this.selectedFile().map((f) => f.file))
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

          const documents = documentUrls.map((url) => {
            return {
              documentType: 'feature_image',
              documentUrl: url,
            };
          });

          return this.listingService.createListing({ ...payload, documents }).pipe(
            finalize(() => this.submitting.set(false)),
            catchError((err) => {
              this.snackBar.open(`${err.error?.error?.message ?? 'Unknown error'}`, 'Ok', {
                duration: 3000,
              });
              return of(null);
            }),
          );
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.snackBar.open('Your listing is under review', 'Ok', {
            duration: 3000,
          });
          this.router.navigate(['/wanted']);
        }
      });
  }
}
