import { Component, Input } from '@angular/core';
import { IconComponent } from 'app/layout/common/icon/icon.component';

type Item = {
  label: string;
  icon: string;
  value: any;
};

@Component({
  selector: 'app-product-description',
  imports: [IconComponent],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss',
})
export class ProductDescriptionComponent {
  @Input({ required: true }) items: Item[] = [];
}
