import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { ListingImageType, ListingMaterial, ListingType } from 'app/models';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { ListingService } from 'app/services/listing.service';
import { MaterialActionComponent } from 'app/share/ui/product-detail/material-action/material-action.component';
import { MaterialOwnerComponent } from 'app/share/ui/product-detail/material-owner/material-owner.component';
import { ProductDescriptionComponent } from 'app/share/ui/product-detail/product-description/product-description.component';
import { ProductImageComponent } from 'app/share/ui/product-detail/product-image/product-image.component';
import { ShareListingComponent } from 'app/share/ui/product-detail/share-listing/share-listing.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { catchError, EMPTY, filter, finalize, map, switchMap, tap } from 'rxjs';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { AuthService } from 'app/services/auth.service';
import { ProductExpiryComponent } from 'app/share/ui/listing/product-expiry/product-expiry.component';
import { ProductGridComponent } from 'app/share/ui/listing/product-grid/product-grid.component';
import { ProductStatusComponent } from 'app/share/ui/listing/product-status/product-status.component';
import { ReviewStatusComponent } from 'app/share/ui/product-detail/review-status/review-status.component';
import { getListingTitle } from 'app/share/utils/offer';
import { isNil } from 'lodash';

@Component({
  selector: 'app-listing-offers-detail',
  imports: [
    ProductImageComponent,
    ProductExpiryComponent,
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
    ProductGridComponent,
    TranslateModule,
  ],
  templateUrl: './listing-offers-detail.component.html',
  styleUrl: './listing-offers-detail.component.scss',
})
export class ListingOffersDetailComponent {
  mapCountryCodeToName = mapCountryCodeToName;
  relateListing: ListingMaterial[] = [];

  listingService = inject(ListingService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  auth = inject(AuthService);

  offerId = signal<number | undefined>(undefined);
  listingDetail = signal<ListingMaterialDetail | undefined>(undefined);
  isSeller = computed(() => this.listingDetail()?.listing?.listingType === ListingType.SELL);
  loading = signal(false);
  userId = toSignal(this.auth.user$.pipe(map((user) => user?.userId)));
  isOwnListing = computed(() => this.userId() === this.listingDetail()?.listing.createdByUserId);

  getListingTitle = getListingTitle;

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
    this.route.paramMap
      .pipe(
        map((params) => params.get('offerId')),
        filter((id) => id !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => {
        this.offerId.set(Number(id));
        this.setup();
      });
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
        takeUntilDestroyed(this.destroyRef),

        tap((res) => {
          this.listingDetail.set(res.data);
          this.images =
            res.data.listing?.documents
              .filter((i) => i.documentType === ListingImageType.GALLERY_IMAGE)
              .map((d) => d.documentUrl) ?? [];
        }),

        switchMap(() =>
          this.listingService
            .get({
              skip: 0,
              limit: 10,
              where: { listingType: this.listingDetail()?.listing.listingType },
            })
            .pipe(map((res) => res.results.filter((item) => item.id !== this.offerId()).slice(0, 4))),
        ),
        tap((res) => {
          this.relateListing = res;
        }),

        catchError((err) => {
          this.snackBar.open(
            localized$(`${err.error?.error?.message || 'Failed to load details. Please refresh the page.'}`),
            localized$('OK'),
            {
              duration: 3000,
            },
          );
          return EMPTY;
        }),

        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  onSelect(item: ListingMaterial) {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.listingOfferDetail}/${item.id}`);
  }

  onBack() {
    const type = this.listingDetail()?.listing.listingType;

    if (type === 'sell') {
      this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
    } else if (type === 'wanted') {
      this.router.navigateByUrl(ROUTES_WITH_SLASH.wanted);
    }
  }
}
