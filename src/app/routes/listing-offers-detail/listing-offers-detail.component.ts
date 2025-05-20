import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { ListingService } from 'app/services/listing.service';
import { MaterialActionComponent } from 'app/share/ui/product-detail/material-action/material-action.component';
import { MaterialOwnerComponent } from 'app/share/ui/product-detail/material-owner/material-owner.component';
import { ProductDescriptionComponent } from 'app/share/ui/product-detail/product-description/product-description.component';
import { ProductImageComponent } from 'app/share/ui/product-detail/product-image/product-image.component';
import { ShareListingComponent } from 'app/share/ui/product-detail/share-listing/share-listing.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { isNil } from 'lodash';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-listing-offers-detail',
  imports: [
    ProductImageComponent,
    MaterialOwnerComponent,
    ProductDescriptionComponent,
    SpinnerComponent,
    MatButtonModule,
    CommonLayoutComponent,
    ShareListingComponent,
    MaterialActionComponent,
  ],
  templateUrl: './listing-offers-detail.component.html',
  styleUrl: './listing-offers-detail.component.scss',
})
export class ListingOffersDetailComponent {
  offerId = signal<number | undefined>(undefined);
  listingDetail = signal<ListingMaterialDetail | undefined>(undefined);
  isSeller = computed(() => this.listingDetail()?.listing?.listingType === 'sell');

  loading = signal(false);
  listingService = inject(ListingService);

  mapCountryCodeToName = mapCountryCodeToName;

  descriptionItems = computed(() => {
    const detail = this.listingDetail();
    return [
      {
        label: 'Material',
        icon: 'recycling',
        value: detail?.listing.materialType,
      },
      {
        label: 'Price per Load',
        icon: 'sell',
        value: 'Inviting Bids',
      },
      {
        label: `No. of Loads`,
        icon: 'view_module',
        value: detail?.listing.quantity,
      },
      {
        label: 'Remaining Loads',
        icon: 'hourglass_top',
        value: detail?.listing.remainingQuantity,
      },
      {
        label: 'Average Weight per Load',
        icon: 'fitness_center',
        value: detail?.listing.materialWeightPerUnit,
      },
      {
        label: 'Material Location',
        icon: 'location_on',
        value: detail?.listing.country ? mapCountryCodeToName[detail?.listing.country] : '',
      },
    ];
  });

  constructor(private route: ActivatedRoute) {
    const offerId = route.snapshot.params['offerId'];
    this.offerId.set(Number(offerId));

    this.setup();
  }

  setup() {
    const offerId = this.offerId();
    if (isNil(offerId)) {
      return;
    }

    this.loading.set(true);
    this.listingService
      .getDetail(offerId)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe((res) => {
        this.listingDetail.set(res.data);
      });
  }
}
