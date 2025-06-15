import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { ListingService } from 'app/services/listing.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-request-information',
  templateUrl: './request-information.component.html',
  styleUrls: ['./request-information.component.scss'],
  imports: [
    MatDialogModule,
    IconComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class RequestInformationComponent implements OnInit {
  formGroup = new FormGroup({
    requestPictures: new FormControl<boolean>(false),
    requestSpecSheets: new FormControl<boolean>(false),
    requestDescription: new FormControl<boolean>(false),
    freeText: new FormControl<string | null>(null, Validators.maxLength(1000)),
  });

  submitting = signal<boolean>(false);

  snackBar = inject(MatSnackBar);
  listingService = inject(ListingService);
  destroyRef = inject(DestroyRef);

  readonly dialogRef = inject(MatDialogRef<{ [key: string]: number }>);
  readonly data = inject<{ listingId: number }>(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}

  submit() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }
    this.submitting.set(true);
    const payload: any = this.formGroup.value;

    if (this.data.listingId) {
      payload['listingId'] = this.data?.listingId;
    }
    this.listingService
      .requestInformation(payload)
      .pipe(
        finalize(() => this.submitting.set(false)),
        catchError((err) => {
          this.snackBar.open('Failed to send request. Please try again or contact support.', 'Ok', { duration: 3000 });
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        if (res) {
          this.snackBar.open('Your request has been successfully sent', 'Ok', { duration: 3000 });
          this.dialogRef.close(true);
        }
      });
  }
}
