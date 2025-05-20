import { Component, Input } from '@angular/core';
import { IconComponent } from 'app/layout/common/icon/icon.component';

type Item = {
  label: string;
  icon: string;
  value: any;
};

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss',
  imports: [IconComponent],
})
export class ProductDescriptionComponent {
  @Input({ required: true }) items: Item[] = [];
}
