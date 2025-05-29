import { Component, inject } from '@angular/core';
import { OfferService } from 'app/services/offer.service';
import { ListContainerComponent } from 'app/share/ui/list-container/list-container.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
  imports: [PurchaseDetailComponent, ListContainerComponent],
  providers: [OfferService],
})
export class PurchasesComponent {
  offerService = inject(OfferService);
}
