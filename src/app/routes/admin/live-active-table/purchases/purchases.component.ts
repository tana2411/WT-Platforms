import { Component, inject } from '@angular/core';
import { OfferState, OfferStatus } from 'app/models/offer';
import { OfferService } from 'app/services/offer.service';
import { ListContainerComponent } from 'app/share/ui/list-container/list-container.component';
import { allFilters } from 'app/share/ui/listing/filter/constant';
import { ItemOf } from 'app/types/utils';
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
  customOptionValues: Record<ItemOf<typeof allFilters>['value'], any> = {
    status: [
      { code: OfferStatus.PENDING, name: 'Pending' },
      { code: OfferStatus.APPROVED, name: 'Approved' },
      {
        code: OfferStatus.ACCEPTED,
        name: 'Accepted',
      },
      { code: OfferStatus.REJECTED, name: 'Rejected' },
    ],
    state: [
      { code: OfferState.PENDING, name: 'Pending' },
      {
        code: OfferState.ACTIVE,
        name: 'Active',
      },
      { code: OfferState.CLOSED, name: 'Closed' },
    ],
  };
}
