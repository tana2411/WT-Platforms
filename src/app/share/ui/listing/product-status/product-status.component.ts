import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ListingMaterial } from 'app/models';
import { ProductStatus } from 'app/models/product.model';
import moment from 'moment';

@Component({
  selector: 'app-product-status',
  imports: [MatIconModule],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.scss',
})
export class ProductStatusComponent implements OnInit {
  @Input({ required: true }) product: ListingMaterial | undefined;
  status: ProductStatus = ProductStatus.Required;
  ProductStatus = ProductStatus;

  constructor() {}

  ngOnInit() {}

  get fromDate() {
    if (!this.product?.startDate) {
      return undefined;
    }

    return moment(this.product.startDate).format('DD/MM/YYYY');
  }
}
