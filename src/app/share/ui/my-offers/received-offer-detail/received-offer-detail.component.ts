import { Component, computed, effect, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OfferListingItem } from 'app/models/offer';
import { OfferService } from 'app/services/offer.service';
import { OfferDetail } from 'app/types/requests/offer';
import moment from 'moment';
import { startWith, Subject, switchMap } from 'rxjs';
import { OfferListingComponent } from '../../offer-listing/offer-listing.component';
import { ProductDescriptionComponent } from '../../product-detail/product-description/product-description.component';
import { ProductImageComponent } from '../../product-detail/product-image/product-image.component';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-received-offer-detail',
  imports: [ProductImageComponent, ProductDescriptionComponent, SpinnerComponent, OfferListingComponent],
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
        icon: 'weight',
        value: offer?.listing.materialWeightPerUnit,
      },
      {
        label: 'Best Offer',
        icon: 'library_books',
        value: offer?.listing.bestOffer,
      },
      {
        label: `Seller's Total Amount`,
        icon: 'sell',
        value: offer?.offer.sellerTotalAmount,
      },
      {
        label: 'Number of Offers',
        icon: 'low_density',
        value: offer?.listing.numberOfOffers,
      },
      {
        label: 'Loads Remaining',
        icon: 'hourglass_top',
        value: offer?.listing.remainingQuantity,
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
    const { listing, offer, buyerCompany } = offerDetail;

    return {
      id: offer.id,
      date: moment(offer.createdAt).format('YYYY-MM-DD'),
      buyerId: buyerCompany.id,
      status: offer.status,
      bidAmount: `${offer.pricePerUnit}/${listing.materialWeightPerUnit}`,
    };
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  onRefresh() {
    this.updator.next();
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
}
