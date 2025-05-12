import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductStatus } from 'app/models/product.model';
import moment from 'moment';

@Component({
  selector: 'app-product-status',
  imports: [MatIconModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.scss',
})
export class ProductStatusComponent {
  @Input({ required: true }) product: Product | undefined;

  ProductStatus = ProductStatus;

  get fromDate() {
    if (!this.product?.fromDate) {
      return undefined;
    }

    return moment(this.product.fromDate).format('DD/MM/YYYY');
  }
}
