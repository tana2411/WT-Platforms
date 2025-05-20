import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { BiddingFormComponent, BiddingFormProps } from '../bidding-form/bidding-form.component';

@Component({
  selector: 'app-material-action',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './material-action.component.html',
  styleUrl: './material-action.component.scss',
})
export class MaterialActionComponent {
  @Input({ required: true }) isSeller: boolean = false;
  @Input({ required: true }) listingDetail: ListingMaterialDetail | undefined;

  dialog = inject(MatDialog);

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
}
