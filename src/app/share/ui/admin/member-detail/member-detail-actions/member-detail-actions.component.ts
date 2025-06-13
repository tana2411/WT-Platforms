import {
  Component,
  computed,
  EventEmitter,
  inject,
  Injector,
  input,
  Output,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { RejectModalComponent } from '../../reject-modal/reject-modal.component';

@Component({
  selector: 'app-member-detail-actions',
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './member-detail-actions.component.html',
  styleUrl: './member-detail-actions.component.scss',
})
export class MemberDetailActionsComponent {
  @Output() refresh = new EventEmitter<void>();

  dialogService = inject(MatDialog);
  snackbar = inject(MatSnackBar);
  injector = inject(Injector);

  user = input<any>({
    id: 22,
    status: 'pending',
  });

  submitting = signal<'accept' | 'reject' | 'request' | undefined>(undefined);
  canAction = computed(() => (this.user().state = 'pending'));

  onApprove = () => {
    // const offerId = this.offerId();
    // if (!offerId || this.submitting()) {
    //   return;
    // }
    // this.submitting.set('accept');
    // runInInjectionContext(this.injector, () => {
    //   this.adminOfferService
    //     .callAction(offerId, OfferRequestActionEnum.ACCEPT, {})
    //     .pipe(
    //       tap(() => {
    //         this.snackbar.open('The approval action was sent successfully.');
    //         this.refresh.emit();
    //       }),
    //       catchError(() => {
    //         this.snackbar.open('Unable to process the approval action. Please try again.');
    //         return EMPTY;
    //       }),
    //       takeUntilDestroyed(),
    //       finalize(() => {
    //         this.submitting.set(undefined);
    //       }),
    //     )
    //     .subscribe();
    // });
  };

  onReject = () => {
    const userId = this.user().id;
    if (!userId || this.submitting()) {
      return;
    }

    this.submitting.set('reject');
    const dataConfig: MatDialogConfig = {
      width: '100%',
      maxWidth: '960px',
    };
    const dialogRef = this.dialogService.open(RejectModalComponent, dataConfig);

    runInInjectionContext(this.injector, () => {
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((params) => {
            if (!params) {
              return EMPTY;
            }

            // todo: implement
            return EMPTY;
            // return this.adminOfferService.callAction(offerId, OfferRequestActionEnum.REJECT, params);
          }),
          tap(() => {
            this.refresh.emit();
            this.snackbar.open('The rejection action was sent successfully.');
          }),
          catchError(() => {
            this.snackbar.open('Unable to process the rejection action. Please try again.');
            return EMPTY;
          }),
          takeUntilDestroyed(),
          finalize(() => {
            this.submitting.set(undefined);
          }),
        )
        .subscribe();
    });
  };

  onRequestMoreInformation() {
    // todo: implement
  }
}
