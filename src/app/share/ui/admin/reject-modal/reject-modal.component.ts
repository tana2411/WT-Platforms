import { Component, inject, Injector } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminListingService } from 'app/services/admin/admin-listing.service';
import { tap } from 'rxjs';

interface RejectionReasonOpt {
  label: string;
  value: string;
}

enum RejectionReason {
  IncompleteDocument = 'Incomplete documentation',
  InvalidCompany = 'Invalid company registration',
  Duplicate = 'Duplicate account',
  Unverified = 'Unverified contact information',
  Other = 'Other',
}

@Component({
  selector: 'app-reject-modal',
  imports: [
    FormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [AdminListingService],
  templateUrl: './reject-modal.component.html',
  styleUrl: './reject-modal.component.scss',
})
export class RejectModalComponent {
  RejectionReason = RejectionReason;
  rejectionReasons: RejectionReasonOpt[] = [
    { label: 'Incomplete documentation', value: RejectionReason.IncompleteDocument },
    { label: 'Invalid company registration', value: RejectionReason.InvalidCompany },
    { label: 'Duplicate account', value: RejectionReason.Duplicate },
    { label: 'Unverified contact information', value: RejectionReason.Unverified },
    { label: 'Other (admin to provide a custom reason)', value: RejectionReason.Other },
  ];

  rejectForm = new FormGroup({
    rejectionReason: new FormControl<string | null>(null, [Validators.required]),
    message: new FormControl<string | null>(null),
  });

  adminListingService = inject(AdminListingService);
  injector = inject(Injector);
  snackbar = inject(MatSnackBar);

  constructor(private dialogRef: MatDialogRef<RejectModalComponent>) {
    this.rejectForm.valueChanges
      .pipe(
        tap((v) => {
          if (v.rejectionReason === RejectionReason.Other) {
            this.rejectForm.get('message')?.addValidators([Validators.required]);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  confirm(): void {
    if (!this.rejectForm.valid) {
      return;
    }

    const { rejectionReason, message } = this.rejectForm.value;
    const params = {
      rejectionReason: rejectionReason ?? '',
      message: message ?? '',
    };

    this.dialogRef.close(params);
  }

  close(): void {
    this.dialogRef.close();
  }
}
