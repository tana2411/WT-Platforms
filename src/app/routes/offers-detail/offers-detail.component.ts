import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { OfferService } from 'app/services/offer.service';
import { ReceivedOfferDetailComponent } from 'app/share/ui/my-offers/received-offer-detail/received-offer-detail.component';

@Component({
  selector: 'app-offers-detail',
  imports: [ReceivedOfferDetailComponent, CommonLayoutComponent],
  providers: [OfferService],
  templateUrl: './offers-detail.component.html',
  styleUrl: './offers-detail.component.scss',
})
export class OffersDetailComponent {
  offerId = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {
    const offerId = route.snapshot.params['offerId'];
    this.offerId.set(Number(offerId));
  }
}
