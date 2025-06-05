import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { countries } from '@app/statics';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { Location } from 'app/models';
import { ConfirmDeleteLocationModalComponent } from 'app/share/ui/confirm-delete-location-modal/confirm-delete-location-modal.component';
import { TelephoneFormControlComponent } from '../../../share/ui/telephone-form-control/telephone-form-control.component';
import { TimeInputFormControlComponent } from '../../../share/ui/time-input-form-control/time-input-form-control.component';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TelephoneFormControlComponent,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    TimeInputFormControlComponent,
  ],
})
export class EditSiteComponent implements OnInit {
  mode: 'add' | 'edit' = 'add';
  location: Location | undefined = undefined;
  countryList = countries.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  submitting = signal<boolean>(false);
  showAccessRestriction = signal<boolean>(false);
  selectAllContainerTypes = signal<boolean>(false);

  formGroup = new FormGroup({
    companyName: new FormControl<string | null>(null),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    positionInCompany: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string | null>(null),

    adressLine: new FormControl<string | null>(null, []),
    addressLine2: new FormControl<string | null>(null, []),
    postcode: new FormControl<string | null>(null, []),
    city: new FormControl<string | null>(null, []),
    country: new FormControl<string | null>(null, []),
    stateProvince: new FormControl<string | null>(null, []),
    officeOpenTime: new FormControl<Date | null>(null, []),
    officeCloseTime: new FormControl<Date | null>(null, []),
    loadingRamp: new FormControl<boolean | null>(null, []),
    weighbridge: new FormControl<boolean | null>(null, []),
    containerType: new FormArray([], [Validators.required]),
    selfLoadUnLoadCapability: new FormControl<string | null>(null, [Validators.required]),
    accessRestrictions: new FormControl<string | null>(null, []),
  });

  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  title: any;

  constructor() {
    effect(() => {
      if (this.selectAllContainerTypes()) {
        this.containerType.clear();
        this.containerType.push(new FormControl('all'));
      } else {
        this.containerType.clear();
      }
    });

    effect(() => {
      if (this.showAccessRestriction()) {
        this.formGroup.get('accessRestrictions')?.setValidators([Validators.required]);
      } else {
        this.formGroup.get('accessRestrictions')?.clearValidators();
        this.formGroup.get('accessRestrictions')?.markAsUntouched();
      }
      this.formGroup.get('accessRestrictions')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (currentPath === 'add') {
      this.mode = 'add';
    } else {
      this.mode = 'edit';
    }
  }

  get containerType() {
    return this.formGroup.get('containerType') as FormArray;
  }

  onBack() {
    this.router.navigate([ROUTES_WITH_SLASH.sites]);
  }

  onDeleteLocation() {
    this.dialog.open(ConfirmDeleteLocationModalComponent, {
      maxWidth: '400px',
      width: '100%',
      panelClass: 'px-3',
      data: {
        location: this.location,
      },
    });
  }

  onSelectedItem(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.containerType.push(new FormControl(item));
    } else {
      const idx = this.containerType.controls.findIndex((control) => control.value === item);
      if (idx !== -1) {
        this.containerType.removeAt(idx);
      }
    }
    this.containerType.updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }

  submit() {}
}
