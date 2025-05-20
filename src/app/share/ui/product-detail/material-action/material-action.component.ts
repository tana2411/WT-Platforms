import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { ListingService } from 'app/services/listing.service';
import { ConfirmModalComponent, ConfirmModalProps } from 'app/share/ui/confirm-modal/confirm-modal.component';
import { catchError, EMPTY, finalize } from 'rxjs';
import { BiddingFormComponent, BiddingFormProps } from '../bidding-form/bidding-form.component';

@Component({
  selector: 'app-material-action',
  templateUrl: './material-action.component.html',
  styleUrl: './material-action.component.scss',
  imports: [MatDialogModule, MatButtonModule, RouterModule],
})
export class MaterialActionComponent {
  @Input({ required: true }) isSeller: boolean = false;
  @Input({ required: true }) listingDetail: ListingMaterialDetail | undefined;

  dialog = inject(MatDialog);
  router = inject(Router);
  listingService = inject(ListingService);
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);

  deleting = signal(false);

  onBid() {
    const dialogRef = this.dialog.open(BiddingFormComponent, {
      maxWidth: '750px',
      width: '100%',
      panelClass: 'px-3',
      data: {
        listingId: this.listingDetail?.listing?.id,
        availableQuantity: this.listingDetail?.listing?.quantity,
      } as BiddingFormProps,
    });
  }

  onDeleteListing() {
    this.dialog
      .open<ConfirmModalComponent, ConfirmModalProps>(ConfirmModalComponent, {
        maxWidth: '500px',
        width: '100%',
        panelClass: 'px-3',
        data: {
          title: 'Are you sure you want to remove this listing? This action cannot be undone.',
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((shouldDelete) => {
        if (shouldDelete && this.listingDetail?.listing?.id) {
          this.deleting.set(true);
          this.listingService
            .delete(this.listingDetail?.listing?.id)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              finalize(() => {
                this.deleting.set(false);
              }),
              catchError((err) => {
                if (err?.error?.error?.statusCode == 403) {
                  this.snackBar.open('You do not have permission to remove this listing.', 'Ok', {
                    duration: 3000,
                  });
                } else {
                  this.snackBar.open('Failed to remove the listing. Please try again later.', 'Ok', {
                    duration: 3000,
                  });
                }
                return EMPTY;
              }),
            )
            .subscribe((result) => {
              this.snackBar.open('Your listing has been successfully removed.', 'Ok', {
                duration: 3000,
              });
              this.router.navigate(['/wanted']);
            });
        }
      });
  }
}
