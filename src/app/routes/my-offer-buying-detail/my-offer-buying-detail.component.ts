import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { OfferService } from 'app/services/offer.service';
import { BuyingOfferDetailComponent } from 'app/share/ui/my-offers/buying-offers/buying-offer-detail/buying-offer-detail.component';

@Component({
  selector: 'app-my-offer-buying-detail',
  imports: [BuyingOfferDetailComponent, CommonLayoutComponent],
  providers: [OfferService],
  templateUrl: './my-offer-buying-detail.component.html',
  styleUrl: './my-offer-buying-detail.component.scss',
})
export class MyOfferBuyingDetailComponent {
  route = inject(ActivatedRoute);
  offerId = this.route.snapshot.params['offerId'];
}
