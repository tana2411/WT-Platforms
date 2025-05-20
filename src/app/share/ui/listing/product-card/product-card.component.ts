import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FallbackImageDirective } from '@app/directives';
import { mapCountryCodeToName } from '@app/statics';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { ListingImageType, ListingMaterial } from 'app/models';
import { ProductStatusComponent } from '../product-status/product-status.component';

@Component({
  selector: 'app-product-card',
  imports: [IconComponent, MatIconModule, ProductStatusComponent, FallbackImageDirective],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() materialInterest = true;
  @Input({ required: true }) product: ListingMaterial | undefined;

  mapCountryCodeToName = mapCountryCodeToName;
  constructor() {}

  get featureImage() {
    return this.product?.documents.find((i) => i.documentType === ListingImageType.FEATURE_IMAGE)?.documentUrl ?? '';
  }
}
