import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FallbackImageDirective } from '@app/directives';
import { mapCountryCodeToName } from '@app/statics';
import { TranslateModule } from '@ngx-translate/core';
import { ListingImageType, ListingMaterial } from 'app/models';
import { getListingTitle } from 'app/share/utils/offer';
import { ProductStatusComponent } from '../product-status/product-status.component';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule, ProductStatusComponent, FallbackImageDirective, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() materialInterest = true;
  @Input({ required: true }) product: ListingMaterial | undefined;
  @Input() deletable: boolean = false;
  @Output() delete = new EventEmitter();

  mapCountryCodeToName = mapCountryCodeToName;
  getListingTitle = getListingTitle;
  constructor() {}

  get featureImage() {
    return this.product?.documents.find((i) => i.documentType === ListingImageType.FEATURE_IMAGE)?.documentUrl ?? '';
  }

  onDelete(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.delete.emit();
  }
}
