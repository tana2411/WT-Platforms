import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type ConfirmModalProps = {
  title: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

@Component({
  selector: 'app-confirm-modal',
  imports: [MatButtonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  @Input() title = 'Are you sure ?';

  readonly dialogRef = inject(MatDialogRef<ConfirmModalComponent>);
  readonly props = inject<ConfirmModalProps>(MAT_DIALOG_DATA);

  onOk() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
