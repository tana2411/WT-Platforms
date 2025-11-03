import { Component, computed, signal } from '@angular/core';
import { MaterialItemComponent } from 'app/layout/material-item/material-item.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
interface Offer {
  material: string;
  packaging: string;
  pickupLocation: string;
  destination: string;
  noLoads: number;
  quantityPerLoad: string;
  haulageTotal: string;
  deliveryWindow: string;
  offerStatus: string;
}
@Component({
  selector: 'app-current-offers',
  imports: [MaterialItemComponent, PaginationComponent],
  templateUrl: './current-offers.component.html',
  styleUrl: './current-offers.component.scss',
})
export class CurrentOffersComponent {
  offers = signal<Offer[]>([
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
    {
      material: 'Non-Ferrous - Stainless Steel 304',
      packaging: 'Bales',
      pickupLocation: 'Lanark, South Lanarkshire, United Kingdom',
      destination: 'Gorzów Wielkopolski, Lubuskie, Polska',
      noLoads: 1,
      quantityPerLoad: '24MT',
      haulageTotal: '24MT',
      deliveryWindow: '13/11/2023 - 30/11/2023',
      offerStatus: 'Accepted',
    },
    {
      material: 'Ferrous - Heavy Melting Steel',
      packaging: 'Bulk',
      pickupLocation: 'Birmingham, West Midlands, United Kingdom',
      destination: 'Hamburg, Germany',
      noLoads: 2,
      quantityPerLoad: '28MT',
      haulageTotal: '56MT',
      deliveryWindow: '01/12/2023 - 10/12/2023',
      offerStatus: 'Pending',
    },
    {
      material: 'Copper - Bright Wire',
      packaging: 'Drums',
      pickupLocation: 'Manchester, United Kingdom',
      destination: 'Rotterdam, Netherlands',
      noLoads: 1,
      quantityPerLoad: '22MT',
      haulageTotal: '22MT',
      deliveryWindow: '05/11/2023 - 15/11/2023',
      offerStatus: 'Rejected',
    },
  ]);
  page = signal(1);
  pageSize = 10;

  paginatedOffers = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.offers().slice(start, start + this.pageSize);
  });

  totalItem = computed(() => this.offers().length);

  onPageChange(page: number) {
    this.page.set(page);
  }

  trackByMaterial(index: number, offer: Offer) {
    return offer.material;
  }
}
