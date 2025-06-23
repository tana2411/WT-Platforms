import { Component, effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ListingMaterial, ListingType } from 'app/models';
import { ProductStatus } from 'app/models/product.model';
import moment from 'moment';

@Component({
  selector: 'app-product-status',
  imports: [MatIconModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.scss',
})
export class ProductStatusComponent {
  product = input<ListingMaterial | undefined>(undefined);
  status = signal<ProductStatus | undefined>(undefined);
  ProductStatus = ProductStatus;
  fromDate = signal<string | undefined>(undefined);

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) {
        return;
      }

      const listingType = product.listingType;
      const now = new Date();
      const startDate = product ? product!.startDate : undefined;
      const endDate = product ? product!.endDate : undefined;
      const isFutureProduct = startDate ? moment(startDate).isAfter(now) : undefined;
      const isExpired = endDate ? moment(endDate).isBefore(now) : undefined;
      const isSold = product.remainingQuantity === 0;
      const isOnGoing = (product.remainingQuantity ?? 0) < (product.quantity ?? 0);

      if (isExpired) {
        this.status.set(ProductStatus.Expired);
        return;
      }

      if (isFutureProduct) {
        this.fromDate.set(moment(startDate).format('DD/MM/YYYY'));
        this.status.set(listingType === ListingType.SELL ? ProductStatus.Available : ProductStatus.Required);
        return;
      }

      if (isSold) {
        this.status.set(ProductStatus.Sold);
        return;
      }

      if (isOnGoing) {
        this.status.set(ProductStatus.Ongoing);
        return;
      }

      this.status.set(listingType === ListingType.SELL ? ProductStatus.Available : ProductStatus.Required);
    });
  }
}
