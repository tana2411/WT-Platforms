import { ChangeDetectorRef, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { colour, countries, finishing, materialTypes, packing } from '@app/statics';
import { FileInfo, FileUploadComponent } from '@app/ui';
import { noForbiddenPatternsValidator, pastDateValidator } from '@app/validators';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AddCompanyLocationResponse, ListingImageType } from 'app/models';
import { EditSiteComponent } from 'app/routes/my-sites/edit-site/edit-site.component';
import { AuthService } from 'app/services/auth.service';
import { ListingService } from 'app/services/listing.service';
import { UploadService } from 'app/share/services/upload.service';
import { ResponseGetCompanyLocation } from 'app/types/requests/auth';
import { catchError, filter, finalize, first, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';

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
    MatDialogModule,
    TranslateModule,
  ],
  providers: [TranslatePipe],
  templateUrl: './sell-lising-material-form.component.html',
  styleUrl: './sell-lising-material-form.component.scss',
})
export class SellLisingMaterialFormComponent {
  countryOption = countries;
  materialTypes = materialTypes;
  colourOption = colour;
  finishingOption = finishing;
  packingOption = packing;
  today = new Date();
  @ViewChild('locationSelector') locationSelector!: MatSelect;

  maxFileSize = 5 * 1024 * 1024; // 5mb

  cd = inject(ChangeDetectorRef);
  uploadService = inject(UploadService);
  snackBar = inject(MatSnackBar);
  listingService = inject(ListingService);
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);
  translate = inject(TranslatePipe);
  ref = inject(ChangeDetectorRef);

  // onGoingListing = signal<boolean | undefined>(undefined);
  // hasSpecialData = signal<boolean | undefined>(false);
  itemOption = signal<{ code: string; name: string }[]>([]);
  formOption = signal<{ code: string; name: string }[]>([]);
  gradingOption = signal<{ code: string; name: string }[]>([]);

  featureImageFile = signal<FileInfo[]>([]);
  specialDataFile = signal<FileInfo[]>([]);
  galleryImageFile = signal<FileInfo[]>([]);

  additionalInformationLength = signal<number>(0);
  submitting = signal<boolean>(false);
  locations = signal<ResponseGetCompanyLocation['results']>([]);
  companyId = toSignal(
    this.authService.user$.pipe(
      filter((user) => !!user),
      map((user) => user.companyId),
    ),
  );

  formGroup = new FormGroup({
    locationId: new FormControl<number | null>(null, [Validators.required]),
    hasSpecialData: new FormControl<string | null>('false', [Validators.required]),

    materialType: new FormControl<string | null>(null, [Validators.required]),
    materialItem: new FormControl<string | null>(null, [Validators.required]),
    materialForm: new FormControl<string | null>(null, [Validators.required]),
    materialGrading: new FormControl<string | null>(null, [Validators.required]),
    materialColor: new FormControl<string | null>(null, [Validators.required]),
    materialFinishing: new FormControl<string | null>(null, [Validators.required]),
    materialPacking: new FormControl<string | null>(null, [Validators.required]),
    materialRemainInCountry: new FormControl<string | null>('false', [Validators.required]),
    wasteStoration: new FormControl<string | null>(null, [Validators.required]),
    weightUnit: new FormControl<string | null>(null, [Validators.required]),
    materialWeight: new FormControl<number | null>(null, [Validators.required, Validators.max(1000000000)]),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.max(1000000000)]),

    currency: new FormControl<string | null>(null, [Validators.required]),
    pricePerMetricTonne: new FormControl<string | null>(null, [Validators.required, Validators.max(1000000000)]),

    startDate: new FormControl<Date | null>(null, [Validators.required, pastDateValidator()]),

    ongoingListing: new FormControl<string | null>('false', [Validators.required]),
    listingRenewalPeriod: new FormControl<string | null>(null),
    endDate: new FormControl<Date | null>(null, [Validators.required]),

    description: new FormControl<string | null>(null, [Validators.maxLength(32000), noForbiddenPatternsValidator()]),
  });

  hasSpecialData = toSignal(this.formGroup.controls.hasSpecialData.valueChanges.pipe(map((v) => v === 'true')));
  hasLocation = toSignal(
    this.formGroup.controls.locationId.valueChanges.pipe(startWith(null)).pipe(map((locationId) => !!locationId)),
    {
      initialValue: false,
    },
  );

  constructor() {
    this.today.setDate(this.today.getDate() - 0);
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { materialType, description } = value;
      if (materialType) {
        const selectedMateriaType = materialTypes.find((m) => m.code == materialType);
        if (selectedMateriaType) {
          this.itemOption.set(selectedMateriaType?.materials);
          this.formOption.set(selectedMateriaType?.form);
          this.gradingOption.set(selectedMateriaType?.grading);
        }
      }
      if (description) {
        this.additionalInformationLength.set(description?.length);
      }
    });

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 30);

    this.formGroup.patchValue({ endDate: futureDate }, { emitEvent: false });

    // Control disable / enable form according has location or not
    effect(() => {
      const disableControlNames = Object.keys(this.formGroup.controls).filter((i) => !['locationId'].includes(i));

      disableControlNames.forEach((key) => {
        if (this.hasLocation()) {
          ((this.formGroup.controls as any)[key] as FormControl).enable();
        } else {
          ((this.formGroup.controls as any)[key] as FormControl).disable();
        }
      });
    });

    // Effect add, remove fields
    effect(() => {
      const { materialForm, materialGrading, materialItem } = this.formGroup.controls;
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
        materialItem.setValue('N/A', { emitEvent: false });
      }

      materialItem.updateValueAndValidity();
      materialForm.updateValueAndValidity();
      materialGrading.updateValueAndValidity();
      this.formGroup.updateValueAndValidity();
    });

    this.authService.companyLocations$.pipe(first()).subscribe((data) => {
      this.locations.set(data.results);
    });
  }

  // ngOnInit() {
  //   this.authService.user$
  //     .pipe(
  //       filter((user) => !!user),
  //       take(1),
  //       catchError((err) => {
  //         if (err) {
  //           this.snackBar.open(
  //             'An error occurred while retrieving your information. Please refresh the page or contact support if the problem persists.',
  //             'Ok',
  //             { duration: 3000 },
  //           );
  //         }
  //         return of(null);
  //       }),
  //     )
  //     .subscribe((user) => {
  //       if (user) {
  //         this.companyId = user.company?.id;
  //       }
  //     });
  // }

  fileValid = computed(() => {
    return (
      !!this.featureImageFile().length &&
      this.galleryImageFile().length &&
      (!this.hasSpecialData() || (this.hasSpecialData() && !!this.specialDataFile().length))
    );
  });

  handleFileReady(file: FileInfo[], type: 'featureImage' | 'specialFile' | 'galleryImage') {
    if (file) {
      if (type === 'featureImage') {
        this.featureImageFile.set(file);
      }

      if (type === 'specialFile') {
        this.specialDataFile.set(file);
      }

      if (type === 'galleryImage') {
        this.galleryImageFile.set(file);
      }
    }
  }

  ongoingListingChange(event: MatRadioChange) {
    const { endDate, listingRenewalPeriod } = this.formGroup.controls;
    endDate.markAsUntouched();
    listingRenewalPeriod.markAsUntouched();
    if (event.value == 'true') {
      endDate.clearValidators();
      listingRenewalPeriod.setValidators(Validators.required);
    } else {
      endDate.setValidators([Validators.required, pastDateValidator()]);
      listingRenewalPeriod.clearValidators();
    }

    endDate.updateValueAndValidity();
    listingRenewalPeriod.updateValueAndValidity();
  }

  private convertToTon() {
    const { weightUnit, materialWeight } = this.formGroup.value;
    if (!weightUnit || !materialWeight) return 0;

    return weightUnit === 'lbs'
      ? materialWeight / 2204.62263
      : weightUnit === 'kg'
        ? materialWeight / 1000
        : materialWeight;
  }

  send() {
    if (this.formGroup.invalid) return;
    let {
      weightUnit,
      materialWeight,
      quantity,
      ongoingListing,
      hasSpecialData,
      locationId,
      materialRemainInCountry,
      ...value
    } = this.formGroup.value;

    const payload: any = {
      ...value,
      locationId: Number(locationId),
      materialRemainInCountry: materialRemainInCountry === 'true',
      quantity,
      listingType: 'sell',
      companyId: this.companyId(),
      materialWeightPerUnit: this.convertToTon() / quantity!,
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

    ongoingListing == 'true' ? delete payload.endDate : delete payload.listingRenewalPeriod;

    this.submitting.set(true);

    const filesSources = [this.featureImageFile(), this.specialDataFile() ?? [], this.galleryImageFile()].map(
      (source) => (source.length ? this.uploadService.uploadMultiFile(source.map((f) => f.file)) : of([])),
    );

    forkJoin(filesSources)
      .pipe(
        catchError((err) => {
          this.snackBar.open(
            this.translate.transform(localized$('An error occurred while uploading the file. Please try again.')),
          );
          throw err;
        }),
        map(([featureImages, specialFiles, galleryImages]) => {
          const featureDocuments = (featureImages ?? []).map((url) => ({
            documentType: ListingImageType.FEATURE_IMAGE,
            documentUrl: url,
          }));

          const specialDocuments = (specialFiles ?? []).map((url) => ({
            documentType: ListingImageType.MATERIAL_SPECIFICATION_DATA,
            documentUrl: url,
          }));

          const galleryDocuments = (galleryImages ?? []).map((url) => ({
            documentType: ListingImageType.GALLERY_IMAGE,
            documentUrl: url,
          }));

          return [...featureDocuments, ...specialDocuments, ...galleryDocuments];
        }),
        switchMap((documents) => {
          return this.listingService.createListing({ ...payload, documents }).pipe(
            catchError((err) => {
              this.snackBar.open(
                `${err.error?.error?.message ?? this.translate.transform(localized$('Failed to submit your listing. Please try again. If the problem persists, contact support.'))}`,
              );
              throw err;
            }),
          );
        }),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe((result) => {
        this.snackBar.open(this.translate.transform(localized$('Your listing is under review')));
        this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
      });
  }

  onAddOther() {
    const dialogRef = this.dialog.open(EditSiteComponent, {
      maxWidth: '900px',
      maxHeight: '85vh',
      width: '100%',
      data: {
        dialogMode: true,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        map((data: AddCompanyLocationResponse['data']) => data.companyLocation.id),
        switchMap((locationId) =>
          this.authService.companyLocations$.pipe(
            map((locations) => ({
              locations,
              locationId,
            })),
          ),
        ),
        tap(({ locations, locationId }) => {
          this.locations.set(locations.results);
          setTimeout(() => {
            this.formGroup.controls['locationId'].setValue(locationId);
            this.locationSelector.close();
          }, 0);
        }),
      )
      .subscribe();
  }
}
