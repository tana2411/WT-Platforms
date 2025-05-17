import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { OfferListingItem, OfferStatus } from 'app/models/offer';
import { OfferService } from 'app/services/offer.service';
import { PaginationComponent } from '../listing/pagination/pagination.component';
import { RejectReasonComponent } from '../my-offers/reject-reason/reject-reason.component';

@Component({
  selector: 'app-offer-listing',
  imports: [PaginationComponent, MatButtonModule, MatSnackBarModule, MatDialogModule, RouterModule],
  templateUrl: './offer-listing.component.html',
  styleUrl: './offer-listing.component.scss',
})
export class OfferListingComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Input() items: OfferListingItem[] = [];
  @Output() pageChange = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  constructor(
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  canAcceptReject(status: OfferStatus) {
    return status === OfferStatus.pending;
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onAccept(item: OfferListingItem) {
    this.offerService.acceptBid(item.id).subscribe({
      next: () => {
        this.snackBar.open('Bid accepted successfully.');
        this.refresh.emit();
      },
      error: () => {
        this.snackBar.open('Failed to accept the bid. Please check your network connection and try again.');
      },
    });
  }

  onReject(item: OfferListingItem) {
    const dialogRef = this.dialog.open(RejectReasonComponent, {
      maxWidth: '500px',
      width: '100%',
      panelClass: 'px-3',
    });

    dialogRef.afterClosed().subscribe((reason) => {
      if (!reason) {
        return;
      }

      this.offerService.rejectBid(item.id, reason).subscribe({
        next: () => {
          this.snackBar.open('Bid rejected successfully.');
          this.refresh.emit();
        },
        error: () => {
          this.snackBar.open('Failed to reject the bid. Please try again later.');
        },
      });
    });
  }
}
