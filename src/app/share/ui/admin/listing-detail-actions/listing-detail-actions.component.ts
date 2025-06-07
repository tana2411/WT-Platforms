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
import { AdminListingDetail } from 'app/models/admin/listing.model';
import { OfferState } from 'app/models/offer';
import { AdminListingService } from 'app/services/admin/admin-listing.service';
import { ListingRequestActionEnum } from 'app/types/requests/admin';
import { catchError, EMPTY, tap } from 'rxjs';
import { RejectModalComponent } from '../reject-modal/reject-modal.component';

@Component({
  selector: 'app-listing-detail-actions',
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './listing-detail-actions.component.html',
  styleUrl: './listing-detail-actions.component.scss',
})
export class ListingDetailActionsComponent {
  listingId = input<string | undefined>(undefined);
  listing = input<AdminListingDetail | undefined>(undefined);
  @Output() refresh = new EventEmitter<void>();

  adminListingService = inject(AdminListingService);
  dialogService = inject(MatDialog);
  snackbar = inject(MatSnackBar);
  injector = inject(Injector);

  canAction = computed(() => this.listing()?.bidStatus.state === OfferState.ACTIVE);

  onApprove = () => {
    const listingId = this.listingId();
    if (!listingId) {
      return;
    }

    runInInjectionContext(this.injector, () => {
      this.adminListingService
        .callAction(listingId, ListingRequestActionEnum.ACCEPT, {})
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
    const listingId = this.listingId();
    if (!listingId) {
      return;
    }

    const dataConfig: MatDialogConfig = {
      data: {
        listingId: this.listingId(),
      },
      width: '100%',
      maxWidth: '960px',
    };
    const dialogRef = this.dialogService.open(RejectModalComponent, dataConfig);
    dialogRef
      .afterClosed()
      .pipe(tap(() => this.refresh.emit()))
      .subscribe();
  };

  onRequestMoreInformation = () => {
    const listingId = this.listingId();
    if (!listingId) {
      return;
    }

    runInInjectionContext(this.injector, () => {
      this.adminListingService
        .callAction(listingId, ListingRequestActionEnum.REQUEST_INFORMATION, {})
        .pipe(
          tap(() => {
            this.snackbar.open('The request information action was sent successfully.');
            this.refresh.emit();
          }),
          catchError(() => {
            this.snackbar.open('Unable to send the message. Please try again.');
            return EMPTY;
          }),
          takeUntilDestroyed(),
        )
        .subscribe();
    });
  };
}
