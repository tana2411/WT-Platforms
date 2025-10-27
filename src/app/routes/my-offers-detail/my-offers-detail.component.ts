import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { OfferService } from 'app/services/offer.service';
import { ReceivedOfferDetailComponent } from 'app/share/ui/my-offers/received-offer-detail/received-offer-detail.component';

@Component({
  selector: 'app-my-offers-detail',
  imports: [ReceivedOfferDetailComponent, CommonLayoutComponent, TranslateModule],
  providers: [OfferService],
  templateUrl: './my-offers-detail.component.html',
  styleUrl: './my-offers-detail.component.scss',
})
export class MyOffersDetailComponent {
  offerId = signal<number | undefined>(undefined);

  constructor(private route: ActivatedRoute) {
    const offerId = route.snapshot.params['offerId'];
    this.offerId.set(Number(offerId));
  }
}
