import { Component, effect, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { TableOfferItem } from 'app/models/offer';
import { OfferService } from 'app/services/offer.service';
import { EmptyOfferButton, EmptyOfferComponent } from 'app/share/ui/my-offers/empty-offer/empty-offer.component';
import { OfferTableComponent } from 'app/share/ui/my-offers/offer-table/offer-table.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { OfferDetail } from 'app/types/requests/offer';
import moment from 'moment';
import { finalize } from 'rxjs';
import { LIST_TAB_OFFER, MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP, OfferType } from './constants';

@Component({
  selector: 'app-my-offers',
  imports: [OfferTableComponent, MatTabsModule, SpinnerComponent, CommonLayoutComponent, EmptyOfferComponent],
  providers: [OfferService],
  templateUrl: './my-offers.component.html',
  styleUrl: './my-offers.component.scss',
})
export class MyOffersComponent {
  listTabOffer = LIST_TAB_OFFER;
  listEmptyProps = signal<ReturnType<typeof MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP>>({} as any);

  totalItems = signal(0);
  page = signal(1);

  items = signal<TableOfferItem[] | null>(null);
  loading = signal(false);
  activeTab = signal<number>(0);
  emptyProps = signal<
    | {
        title: string;
        content: string;
        buttons: EmptyOfferButton[];
      }
    | undefined
  >(undefined);

  constructor(
    private router: Router,
    private offerService: OfferService,
  ) {
    this.listEmptyProps.set(MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP(this.router));

    // effect to fetching data and update empty props when the tab change
    effect(async () => {
      const tabKey = this.getTabKey(this.activeTab());
      this.updateEmptyProps(tabKey);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      if (tabKey !== OfferType.Received) {
        this.items.set([]);
        return;
      }

      this.loading.set(true);
      this.offerService
        .getOffers({ page: this.page(), isSeller: true })
        .pipe(
          finalize(() => {
            this.loading.set(false);
          }),
        )
        .subscribe((res) => {
          const tableData = res.results.map(this.mapOfferToTableItem);
          this.items.set(tableData);
          this.totalItems.set(res.totalCount);
        });
    });
  }

  mapOfferToTableItem(offerDetail: OfferDetail): TableOfferItem {
    const { listing, offer, buyer } = offerDetail;

    return {
      id: offer.id,
      date: moment(offer.createdAt).format('YYYY-MM-DD'),
      materialName: listing.title ?? '',
      quantity: offer.quantity,
      country: offer.buyerCountry,
      status: offer.status,
      bidAmount: `${offer.offeredPricePerUnit}/MT`,
    };
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  // get the tab key by index
  getTabKey = (index: number) => {
    const currentTab = this.listTabOffer[index];
    return currentTab.key;
  };

  updateEmptyProps = (tabKey: OfferType) => {
    const emptyProps = this.listEmptyProps()?.[tabKey];
    emptyProps && this.emptyProps.set(emptyProps);
  };

  selectTab({ index }: MatTabChangeEvent) {
    this.activeTab.set(index);
    const tabKey = this.getTabKey(index);
    this.updateEmptyProps(tabKey);
  }
}
