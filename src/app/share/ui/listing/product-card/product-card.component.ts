import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { Product } from 'app/models/product.model';
import { ProductStatusComponent } from '../product-status/product-status.component';

@Component({
  selector: 'app-product-card',
  imports: [IconComponent, MatIconModule, ProductStatusComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() materialInterest = true;
  @Input({ required: true }) product: Product | undefined;
}
