import { Component, computed, effect, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { OfferListingItem } from 'app/models/offer';
import { OfferService } from 'app/services/offer.service';
import { OfferDetail } from 'app/types/requests/offer';
import moment from 'moment';
import { startWith, Subject, switchMap } from 'rxjs';
import { ProductDescriptionComponent } from '../../product-detail/product-description/product-description.component';
import { ProductImageComponent } from '../../product-detail/product-image/product-image.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { OfferListingComponent } from '../offer-listing/offer-listing.component';

@Component({
  selector: 'app-received-offer-detail',
  imports: [
    ProductImageComponent,
    ProductDescriptionComponent,
    SpinnerComponent,
    OfferListingComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './received-offer-detail.component.html',
  styleUrl: './received-offer-detail.component.scss',
})
export class ReceivedOfferDetailComponent implements OnInit {
  @Input({ required: true }) offerId: number | undefined;
  offer = signal<OfferDetail | undefined>(undefined);
  loadingListing = signal(false);
  page = signal(1);
  totalItems = signal(0);
  listingItems = signal<OfferListingItem[] | null>(null);
  updator = new Subject<void>();

  offerDescription = computed(() => {
    const offer = this.offer();
    return [
      {
        label: 'Weight',
        icon: 'fitness_center',
        value: offer?.listing.materialWeightWanted,
      },
      {
        label: 'Best Offer',
        icon: 'pages',
        value: offer?.listing.bestOffer,
      },
      {
        label: `No. loads`,
        icon: 'sell',
        value: offer?.listing.quantity,
      },
      {
        label: 'No. offers',
        icon: 'list_alt',
        value: offer?.listing.numberOfOffers,
      },
      {
        label: 'Loads Remaining',
        icon: 'hourglass_top',
        value: offer?.listing.remainingQuantity,
      },
      {
        label: 'Status',
        icon: 'hourglass_top',
        value: offer?.listing.status,
      },
      // {
      //   label: 'Price per Load',
      //   icon: 'sell',
      //   value: '£250',
      // },
    ];
  });

  constructor(
    private router: Router,
    private offerService: OfferService,
  ) {
    effect(async () => {
      const offer = this.offer();

      if (offer) {
        this.loadingListing.set(true);

        this.offerService.getOffers({ page: this.page(), isSeller: true, listingId: offer.listing.id }).subscribe({
          next: (res) => {
            const tableData = res.results.map(this.mapOfferToTableItem);
            this.listingItems.set(tableData);
            this.totalItems.set(res.totalCount);
            this.loadingListing.set(false);
          },
          error: () => {
            this.loadingListing.set(false);
          },
        });
      }
    });
  }

  mapOfferToTableItem(offerDetail: OfferDetail): OfferListingItem {
    const { listing, offer, buyer } = offerDetail;

    return {
      id: offer.id,
      date: moment(offer.createdAt).format('YYYY-MM-DD'),
      buyerId: offer.buyerCompanyId,
      status: offer.status,
      bidAmount: `${offer.offeredPricePerUnit}/MT`,
      buyerStatus: buyer.company.status,
    };
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  onRefresh() {
    this.updator.next();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    if (!this.offerId) {
      return;
    }

    this.updator
      .pipe(
        startWith(0),
        switchMap(() => this.offerService.getOfferDetail(this.offerId!)),
      )
      .subscribe((res) => {
        this.offer.set(res.data);
      });
  }

  onBack() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.myOffers);
  }
}
