import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { ListingMaterialDetailResponse } from 'app/models/listing-material-detail.model';
import { ListingService } from 'app/services/listing.service';
import { MaterialActionComponent } from 'app/share/ui/product-detail/material-action/material-action.component';
import { MaterialOwnerComponent } from 'app/share/ui/product-detail/material-owner/material-owner.component';
import { ProductDescriptionComponent } from 'app/share/ui/product-detail/product-description/product-description.component';
import { ProductImageComponent } from 'app/share/ui/product-detail/product-image/product-image.component';
import { ShareListingComponent } from 'app/share/ui/product-detail/share-listing/share-listing.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { isNil } from 'lodash';
import { catchError, finalize, of } from 'rxjs';
import { IconComponent } from '../../layout/common/icon/icon.component';
import { ProductStatusComponent } from '../../share/ui/listing/product-status/product-status.component';
import { ReviewStatusComponent } from '../../share/ui/product-detail/review-status/review-status.component';

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
    IconComponent,
    ProductStatusComponent,
    ReviewStatusComponent,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './listing-offers-detail.component.html',
  styleUrl: './listing-offers-detail.component.scss',
})
export class ListingOffersDetailComponent {
  mapCountryCodeToName = mapCountryCodeToName;

  offerId = signal<number | undefined>(undefined);
  listingDetail = signal<ListingMaterialDetailResponse['data'] | undefined>(undefined);
  isSeller = computed(() => this.listingDetail()?.listing?.listingType === 'sell');
  loading = signal(false);

  listingService = inject(ListingService);
  snackBar = inject(MatSnackBar);

  images: string[] = [];
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
        value:
          detail?.listing.remainingQuantity != null
            ? `${detail.listing.remainingQuantity} of ${detail.listing.quantity}`
            : '',
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
        catchError((err) => {
          this.snackBar.open('Failed to load details. Please refresh the page.', 'OK', {
            duration: 300,
          });
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.listingDetail.set(res.data);
          if (this.listingDetail()?.listing) {
            this.images = this.listingDetail()?.listing.documents.map((image) => image.documentUrl) ?? [];
          }
        }
      });
  }
}
