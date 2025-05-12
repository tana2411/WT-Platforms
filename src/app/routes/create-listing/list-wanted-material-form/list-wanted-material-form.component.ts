import { ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { noForbiddenPatternsValidator, pastDateValidator } from '@app/validators';
import { FileInfo, FileUploadComponent } from '../../../share/ui/file-upload/file-upload.component';
import { colour, countries, finishing, materialTypes, packing } from './../../../statics';

@Component({
  selector: 'app-list-wanted-material-form',
  templateUrl: './list-wanted-material-form.component.html',
  styleUrls: ['./list-wanted-material-form.component.scss'],
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
})
export class ListWantedMaterialFormComponent implements OnInit {
  countryOption = countries;
  materialTypes = materialTypes;
  colourOption = colour;
  finishingOption = finishing;
  packingOption = packing;

  onGoingListing = signal<boolean | undefined>(undefined);
  itemOption = signal<string[]>([]);
  formOption = signal<string[]>([]);
  gradingOption = signal<string[]>([]);
  showCustomDuration = signal(false);
  fileError = signal<string | null>(null);
  selectedFile = signal<FileInfo[]>([]);
  additionalInformationLength = signal<number>(0);

  cd = inject(ChangeDetectorRef);

  formGroup = new FormGroup({
    country: new FormControl<string | null>(null, [Validators.required]),
    materialType: new FormControl<string | null>(null, [Validators.required]),
    item: new FormControl<string | null>(null, [Validators.required]),
    form: new FormControl<string | null>(null, [Validators.required]),
    grading: new FormControl<string | null>(null, [Validators.required]),
    colour: new FormControl<string | null>(null, [Validators.required]),
    finishing: new FormControl<string | null>(null, [Validators.required]),
    packing: new FormControl<string | null>(null, [Validators.required]),
    capacityPerMonth: new FormControl<string | null>(null, [Validators.required]),
    materialFlowIndex: new FormControl<string | null>(null, [Validators.required]),
    stored: new FormControl<string | null>(null, [Validators.required]),
    quantityWanted: new FormControl<string | null>(null, [Validators.required]),
    materialWeight: new FormControl<number | null>(null, [Validators.required, Validators.min(3)]),
    weightUnit: new FormControl<string | null>(null, [Validators.required]),
    requiredFrom: new FormControl<Date | null>(null, [Validators.required, pastDateValidator()]),

    additionalInformation: new FormControl<string | null>(null, [
      Validators.maxLength(1000),
      noForbiddenPatternsValidator(),
    ]),

    ongoingListing: new FormControl<string | null>(null, [Validators.required]),
    listingRenewalPeriod: new FormControl<string | null>(null, [Validators.required]),
    listingDuration: new FormControl<string | Date | null>('30_days', [Validators.required]),
    customDurationValue: new FormControl<number | null>(null),
    customDurationUnit: new FormControl<string | null>(null),
    selectEndDate: new FormControl<Date | null>(null, []),
  });

  constructor() {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { materialType, additionalInformation, weightUnit, materialWeight } = value;
      if (materialType) {
        const selectedMateriaType = materialTypes.find((m) => m.code == materialType);
        if (selectedMateriaType) {
          this.itemOption.set(selectedMateriaType?.materials);
          this.formOption.set(selectedMateriaType?.form);
          this.gradingOption.set(selectedMateriaType?.grading);
        }
      }
      if (additionalInformation) {
        this.additionalInformationLength.set(additionalInformation?.length);
      }
    });

    effect(() => {
      const { form, grading, item } = this.formGroup.controls;
      if (this.formOption().length > 0) {
        form.setValidators(Validators.required);
      } else {
        form.clearValidators();
        form.setValue('N/A', { emitEvent: false });
      }

      if (this.gradingOption().length > 0) {
        grading.setValidators(Validators.required);
      } else {
        grading.clearValidators();
        grading.setValue('N/A', { emitEvent: false });
      }

      if (this.itemOption().length > 0) {
        item.setValidators(Validators.required);
      } else {
        item.clearValidators();
      }

      item.updateValueAndValidity();
      form.updateValueAndValidity();
      grading.updateValueAndValidity();
      this.formGroup.updateValueAndValidity();
    });
  }

  ngOnInit() {}

  handleFileReady(file: FileInfo[]) {
    if (file.length > 0) {
      this.selectedFile.set(file);
      this.fileError.set(null);
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
      listingDuration.setValidators(Validators.required);
      listingRenewalPeriod.clearValidators();
    }
  }

  onCustomDurationChange() {
    const { customDurationUnit, customDurationValue, selectEndDate } = this.formGroup.controls;

    if (customDurationValue.value || customDurationUnit.value) {
      selectEndDate.disable();

      customDurationValue.setValidators(Validators.required);
      customDurationUnit.setValidators(Validators.required);
    } else {
      selectEndDate.enable();
      customDurationValue.clearValidators();
      customDurationUnit.clearValidators();
    }

    customDurationUnit.updateValueAndValidity();
    customDurationValue.updateValueAndValidity();
    selectEndDate.updateValueAndValidity();
  }

  onEndDateChange() {
    if (this.formGroup.get('selectEndDate')?.value) {
      this.formGroup.get('customDurationValue')?.disable();
      this.formGroup.get('customDurationUnit')?.disable();
    } else {
      this.formGroup.get('customDurationValue')?.enable();
      this.formGroup.get('customDurationUnit')?.enable();
    }
  }

  send() {
    if (this.formGroup.invalid) return;

    const { weightUnit, materialWeight, ...value } = this.formGroup.value;

    if (weightUnit && materialWeight) {
      const payload: any = {
        ...value,
        weightUnit,
        materialWeight:
          weightUnit == 'lbs'
            ? materialWeight / 2204.62263
            : weightUnit == 'kg'
              ? materialWeight / 1000
              : materialWeight,
      };
      console.log(payload);
    }
  }
}
