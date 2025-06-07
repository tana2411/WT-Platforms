import {
  Component,
  computed,
  EventEmitter,
  inject,
  Injector,
  input,
  Output,
  runInInjectionContext,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OfferRequestActionEnum, OfferState } from 'app/models/offer';
import { AdminOfferService } from 'app/services/admin/admin-offer.service';
import { OfferDetail } from 'app/types/requests/offer';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { RejectModalComponent } from '../reject-modal/reject-modal.component';

@Component({
  selector: 'app-offer-detail-actions',
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './offer-detail-actions.component.html',
  styleUrl: './offer-detail-actions.component.scss',
})
export class OfferDetailActionsComponent {
  offerId = input<string | undefined>(undefined);
  // todo: refactor
  offer = input<OfferDetail | undefined>(undefined);
  @Output() refresh = new EventEmitter<void>();

  adminOfferService = inject(AdminOfferService);
  dialogService = inject(MatDialog);
  snackbar = inject(MatSnackBar);
  injector = inject(Injector);

  canAction = computed(() => this.offer()?.offer.state === OfferState.ACTIVE);

  onApprove = () => {
    const offerId = this.offerId();
    if (!offerId) {
      return;
    }

    runInInjectionContext(this.injector, () => {
      this.adminOfferService
        .callAction(offerId, OfferRequestActionEnum.ACCEPT, {})
        .pipe(
          tap(() => {
            this.snackbar.open('The approval action was sent successfully.');
            this.refresh.emit();
          }),
          catchError(() => {
            this.snackbar.open('Unable to process the approval action. Please try again.');
            return EMPTY;
          }),
          takeUntilDestroyed(),
        )
        .subscribe();
    });
  };

  onReject = () => {
    const offerId = this.offerId();
    if (!offerId) {
      return;
    }

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

            return this.adminOfferService.callAction(offerId, OfferRequestActionEnum.REJECT, params);
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
        )
        .subscribe();
    });
  };
}
