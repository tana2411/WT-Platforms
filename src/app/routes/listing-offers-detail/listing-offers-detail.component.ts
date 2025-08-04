import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { mapCodeToPackaging, mapCountryCodeToName } from '@app/statics';
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

import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { AuthService } from 'app/services/auth.service';
import { ProductExpiryComponent } from 'app/share/ui/listing/product-expiry/product-expiry.component';
import { ProductGridComponent } from 'app/share/ui/listing/product-grid/product-grid.component';
import { ProductStatusComponent } from 'app/share/ui/listing/product-status/product-status.component';
import { ReviewStatusComponent } from 'app/share/ui/product-detail/review-status/review-status.component';
import { getListingTitle, getMaterialTypeLabel } from 'app/share/utils/offer';
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
  providers: [DecimalPipe, TranslatePipe],
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
  decimal = inject(DecimalPipe);
  translate = inject(TranslatePipe);

  offerId = signal<number | undefined>(undefined);
  listingDetail = signal<ListingMaterialDetail | undefined>(undefined);
  isSeller = computed(() => this.listingDetail()?.listing?.listingType === ListingType.SELL);
  loading = signal(false);
  userId = toSignal(this.auth.user$.pipe(map((user) => user?.userId)));
  isOwnListing = computed(() => this.userId() === this.listingDetail()?.listing.createdByUserId);

  getListingTitle = getListingTitle;

  images: string[] = [];
  featureImage: string = '';
  descriptionItems = computed(() => {
    const detail = this.listingDetail();

    if (detail?.listing?.listingType === ListingType.WANTED) {
      return [
        {
          label: this.translate.transform('Material Type'),
          icon: 'recycling',
          value: getMaterialTypeLabel(detail?.listing?.materialType ?? ''),
        },
        {
          label: this.translate.transform(localized$('Material Location')),
          icon: 'location_on',
          value: detail?.listing.country ? mapCountryCodeToName[detail?.listing.country] : '-',
        },
        {
          label: this.translate.transform(localized$(`Quantity`)),
          customIcon: '/assets/images/icons/dumbbell.svg',
          value: `${this.decimal.transform(detail?.listing.materialWeightWanted ?? 0)} ${this.translate.transform(localized$('MT'))}`,
        },
        {
          label: this.translate.transform(localized$(`Packaging`)),
          customIcon: '/assets/images/icons/cube.svg',
          value: `${detail?.listing?.materialPacking ? mapCodeToPackaging[detail?.listing?.materialPacking] : '-'}`,
        },
        {
          label: this.translate.transform(localized$(`Description`)),
          icon: 'article',
          value: `${detail?.listing?.additionalNotes ?? '-'}`,
        },
      ];
    }

    const country = detail?.locationDetails.address.country
      ? mapCountryCodeToName[detail.locationDetails.address.country]
      : '';

    return [
      {
        label: this.translate.transform(localized$('Material')),
        icon: 'recycling',
        value: getMaterialTypeLabel(detail?.listing?.materialType ?? ''),
      },
      {
        label: this.translate.transform(localized$('Price per Load')),
        icon: 'sell',
        value: this.translate.transform(localized$('Inviting Bids')),
      },
      {
        label: this.translate.transform(localized$(`No. of Loads`)),
        icon: 'view_module',
        value: this.decimal.transform(detail?.listing.quantity ?? 0),
      },
      {
        label: this.translate.transform(localized$('Remaining Loads')),
        icon: 'hourglass_top',
        value:
          detail?.listing.remainingQuantity != null
            ? `${this.decimal.transform(detail.listing.remainingQuantity ?? 0)} of ${this.decimal.transform(detail.listing.quantity ?? 0)}`
            : '',
      },
      {
        label: this.translate.transform(localized$('Average Weight per Load')),
        icon: 'fitness_center',
        value: `${detail?.listing.materialWeightPerUnit ?? 0} MT`,
      },
      {
        label: this.translate.transform(localized$('Material Location')),
        icon: 'location_on',
        value: country,
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
          this.featureImage =
            res.data.listing?.documents.find((i) => i.documentType === ListingImageType.FEATURE_IMAGE)?.documentUrl ??
            '';
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
            this.translate.transform(
              localized$(`${err.error?.error?.message || 'Failed to load details. Please refresh the page.'}`),
            ),
            this.translate.transform(localized$('OK')),
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
    window.history.back();
  }
}
