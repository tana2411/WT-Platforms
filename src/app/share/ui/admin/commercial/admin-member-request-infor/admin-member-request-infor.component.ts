import { Component, inject, Injector } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

interface Option {
  label: string;
  value: string;
}

enum RequestInfo {
  Additional = 'Additional company documentation required',
  Clarification = 'Clarification on provided details',
  UpdateON = 'Update on business address',
  Other = 'Other (Provide a custom request)',
}

enum SendMessage {
  Welcome = 'Welcome to WasteTrade! Please complete your profile.',
  UnderReview = 'Your application is under review. Please be patient.',
  Additional = 'We need additional information to complete your application.',
  Other = 'Other (Provide a custom request)',
}

@Component({
  selector: 'app-admin-member-request-infor',
  imports: [
    FormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-member-request-infor.component.html',
  styleUrl: './admin-member-request-infor.component.scss',
})
export class AdminMemberRequestInforComponent {
  RequestInfo = RequestInfo;
  SendMessage = SendMessage;

  requestInfo: Option[] = [
    { label: 'Additional company documentation required', value: RequestInfo.Additional },
    { label: 'Clarification on provided details', value: RequestInfo.Clarification },
    { label: 'Update on business address', value: RequestInfo.UpdateON },
    { label: 'Other (Provide a custom request)', value: RequestInfo.Other },
  ];

  sendMessage: Option[] = [
    { label: 'Additional company documentation required', value: SendMessage.Welcome },
    { label: 'Clarification on provided details', value: SendMessage.UnderReview },
    { label: 'Update on business address', value: SendMessage.Additional },
    { label: 'Other (Provide a custom request)', value: SendMessage.Other },
  ];

  requestInfoForm = new FormGroup({
    requestInfo: new FormControl<string | null>(null, [Validators.required]),
    message: new FormControl<string | null>(null),
    sendMessage: new FormControl<string | null>(null),
    otherMessage: new FormControl<string | null>(null),
  });

  // adminListingService = inject(AdminListingService);
  injector = inject(Injector);

  constructor(private dialogRef: MatDialogRef<AdminMemberRequestInforComponent>) {
    this.requestInfoForm.valueChanges
      .pipe(
        tap((v) => {
          if (v.requestInfo === RequestInfo.Other) {
            this.requestInfoForm.get('message')?.addValidators([Validators.required]);
          }

          if (v.sendMessage === SendMessage.Other) {
            this.requestInfoForm.get('otherMessage')?.addValidators([Validators.required]);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  confirm(): void {
    if (!this.requestInfoForm.valid) {
      return;
    }

    const { sendMessage, message, otherMessage, requestInfo } = this.requestInfoForm.value;
    const params = {
      message: message ?? '',
      otherMessage: otherMessage ?? '',
      requestInfo: requestInfo ?? '',
      sendMessage: sendMessage ?? '',
    };

    this.dialogRef.close(params);
  }

  close(): void {
    this.dialogRef.close();
  }
}
