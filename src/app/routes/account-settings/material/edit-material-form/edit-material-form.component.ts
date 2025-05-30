import { AfterViewInit, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { materialTypes } from '@app/statics';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { SettingsService } from 'app/services/settings.service';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-edit-material-form',
  templateUrl: './edit-material-form.component.html',
  styleUrls: ['./edit-material-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogClose,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    IconComponent,
    MatExpansionModule,
  ],
})
export class EditMaterialFormComponent implements OnInit, AfterViewInit {
  materialType = materialTypes;
  selectAllMaterial = signal(false);
  submitting = signal(false);

  formGroup = new FormGroup({
    favoriteMaterials: new FormArray([], [Validators.required]),
  });

  readonly dialogRef = inject(MatDialogRef<string[]>);
  readonly data = inject<{ materials: string[]; companyId: number }>(MAT_DIALOG_DATA);
  snackBar = inject(MatSnackBar);
  settingsService = inject(SettingsService);

  get favoriteMaterials(): FormArray {
    return this.formGroup.get('favoriteMaterials') as FormArray;
  }

  isCheckedSelectAllMaterial = computed(() => {
    return this.favoriteMaterials.length === this.materialType.flatMap((m) => m.materials).length;
  });

  constructor() {
    let isFirstRun = true;

    effect(() => {
      const selectAll = this.selectAllMaterial();

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      this.favoriteMaterials.clear();

      if (selectAll) {
        this.materialType
          .flatMap((m) => m.materials)
          .forEach((item) => {
            this.favoriteMaterials.push(new FormControl(item.code));
          });
        this.favoriteMaterials.markAsTouched();
      }

      this.favoriteMaterials.updateValueAndValidity();
      this.favoriteMaterials.markAsDirty();
    });
  }

  ngOnInit() {
    if (this.data.materials.length > 0) {
      this.data.materials.forEach((material) => {
        this.favoriteMaterials.push(new FormControl(material));
      });
      this.favoriteMaterials.updateValueAndValidity();
      this.formGroup.updateValueAndValidity();
    }
  }

  ngAfterViewInit(): void {
    if (this.isCheckedSelectAllMaterial()) {
      this.selectAllMaterial.set(true);
    }
  }

  onSelectedMaterial(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.favoriteMaterials.push(new FormControl(item));
    } else {
      const idx = this.favoriteMaterials.controls.findIndex((control) => control.value === item);
      if (idx !== -1) {
        this.favoriteMaterials.removeAt(idx);
      }
    }
    this.favoriteMaterials.markAsTouched();
    this.favoriteMaterials.markAsDirty();
    this.favoriteMaterials.updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }

  submit() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    this.submitting.set(true);
    const payload: string[] = this.favoriteMaterials.value;

    this.settingsService
      .updateMaterialPreferences(this.data.companyId, payload)
      .pipe(
        catchError((err) => {
          this.snackBar.open('Failed to save changes. Please try again.', 'OK', { duration: 3000 });
          return EMPTY;
        }),
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe((res) => {
        this.snackBar.open('Your material preferences have been updated successfully.', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      });
  }

  isOpenGroup(materials: any[]) {
    return materials.some((m) => this.data.materials.includes(m.code));
  }
}
