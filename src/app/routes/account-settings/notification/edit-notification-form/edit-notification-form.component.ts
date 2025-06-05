import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { User } from 'app/models';
import { ConfirmModalComponent } from 'app/share/ui/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-edit-notification-form',
  templateUrl: './edit-notification-form.component.html',
  styleUrls: ['./edit-notification-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogClose,
    MatButtonModule,
    MatSnackBarModule,
    MatRadioModule,
    IconComponent,
    MatFormFieldModule,
    MatDialogModule,
  ],
})
export class EditNotificationFormComponent implements OnInit {
  formGroup = new FormGroup({
    notificationEmailEnabled: new FormControl<boolean | null>(null),
    notificationPushEnabled: new FormControl<boolean | null>(null),
    notificationInAppEnabled: new FormControl<boolean | null>(null),
  });

  submitting = signal(false);

  readonly dialogRef = inject(MatDialogRef<User>);
  readonly data = inject<{ userInfo: User }>(MAT_DIALOG_DATA);
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  constructor() {}

  ngOnInit() {
    if (this.data.userInfo) {
      const user = this.data.userInfo.user;
      this.formGroup.patchValue({
        notificationEmailEnabled: user.notificationEmailEnabled,
        notificationPushEnabled: user.notificationPushEnabled,
        notificationInAppEnabled: user.notificationInAppEnabled,
      });
    }
  }

  close() {
    if (this.formGroup.pristine) {
      this.dialogRef.close(false);
      return;
    }

    this.dialog
      .open(ConfirmModalComponent, {
        maxWidth: '500px',
        width: '100%',
        panelClass: 'px-3',
        data: {
          title: 'You have unsaved changes. Are you sure you want to close without saving?',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((close) => {
        if (!close) return;

        this.dialogRef.close(false);
      });
  }

  submit() {}
}
