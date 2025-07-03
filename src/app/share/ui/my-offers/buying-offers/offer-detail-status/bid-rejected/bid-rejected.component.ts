import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { getLocationAddress, getOfferStatusColor } from 'app/share/utils/offer';
import { OfferDetail } from 'app/types/requests/offer';

@Component({
  selector: 'app-bid-rejected',
  imports: [MatButtonModule, DatePipe],
  templateUrl: './bid-rejected.component.html',
  styleUrl: './bid-rejected.component.scss',
})
export class BidRejectedComponent {
  router = inject(Router);

  offer = input<OfferDetail | undefined>(undefined);
  getLocationAddress = getLocationAddress;
  getOfferStatusColor = getOfferStatusColor;

  onFindNew() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
  }
}
