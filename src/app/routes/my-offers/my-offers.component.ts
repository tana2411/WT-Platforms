import { Component, effect, signal } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { Offer, OfferStatus } from 'app/models/offer';
import { EmptyOfferButton, EmptyOfferComponent } from 'app/share/ui/my-offers/empty-offer/empty-offer.component';
import { OfferTableComponent } from 'app/share/ui/my-offers/offer-table/offer-table.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { LIST_TAB_OFFER, MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP, OfferType } from './constants';

@Component({
  selector: 'app-my-offers',
  imports: [OfferTableComponent, MatTabsModule, SpinnerComponent, CommonLayoutComponent, EmptyOfferComponent],
  templateUrl: './my-offers.component.html',
  styleUrl: './my-offers.component.scss',
})
export class MyOffersComponent {
  listTabOffer = LIST_TAB_OFFER;
  listEmptyProps = signal<ReturnType<typeof MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP>>({} as any);

  totalItems = 55;
  items = signal<Offer[] | null>(null);
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

  constructor(private router: Router) {
    this.listEmptyProps.set(MAP_OFFER_TYPE_TO_EMPTY_OFFER_PROP(this.router));

    // effect to fetching data and update empty props when the tab change
    effect(async () => {
      this.loading.set(true);
      const tabKey = this.getTabKey(this.activeTab());
      this.updateEmptyProps(tabKey);

      await new Promise<void>((res) =>
        setTimeout(() => {
          if (tabKey === OfferType.Received) {
            this.items.set([
              {
                id: '1',
                date: '2025-05-13T08:08:14.030Z',
                materialName: 'Non-Ferrous - Stainless Steel 304',
                quantity: '23MT',
                country: 'United Kingdom',
                status: OfferStatus.pending,
                bidAmount: '$1500/MT',
              },
              {
                id: '2',
                date: '2025-05-13T08:08:14.030Z',
                materialName: 'Non-Ferrous - Stainless Steel 304',
                quantity: '23MT',
                country: 'United Kingdom',
                status: OfferStatus.pending,
                bidAmount: '$1500/MT',
              },
              {
                id: '3',
                date: '2025-05-13T08:08:14.030Z',
                materialName: 'Non-Ferrous - Stainless Steel 304',
                quantity: '23MT',
                country: 'United Kingdom',
                status: OfferStatus.pending,
                bidAmount: '$1500/MT',
              },
              {
                id: '4',
                date: '2025-05-13T08:08:14.030Z',
                materialName: 'Non-Ferrous - Stainless Steel 304',
                quantity: '23MT',
                country: 'United Kingdom',
                status: OfferStatus.pending,
                bidAmount: '$1500/MT',
              },
              {
                id: '5',
                date: '2025-05-13T08:08:14.030Z',
                materialName: 'Non-Ferrous - Stainless Steel 304',
                quantity: '23MT',
                country: 'United Kingdom',
                status: OfferStatus.pending,
                bidAmount: '$1500/MT',
              },
            ]);
          } else {
            this.items.set([]);
          }
          res();
        }, 1000),
      );
      this.loading.set(false);
    });
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
