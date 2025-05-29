import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listing-detail-actions',
  imports: [MatButtonModule],
  templateUrl: './listing-detail-actions.component.html',
  styleUrl: './listing-detail-actions.component.scss',
})
export class ListingDetailActionsComponent {
  listingId = input<string | undefined>(undefined);

  onApprove = () => {
    console.log('approve ' + this.listingId);
  };

  onReject = () => {
    console.log('onReject ' + this.listingId);
  };

  onRequestMoreInformation = () => {
    console.log('onRequestMoreInformation ' + this.listingId);
  };
}
