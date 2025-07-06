import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { upperFirst } from 'lodash';

type Item = {
  label: string;
  icon?: string;
  color?: string;
  class?: string;
  value: any;
};

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss',
  imports: [IconComponent, TranslateModule],
})
export class ProductDescriptionComponent {
  @Input({ required: true }) items: Item[] = [];
  @Input() showMaterialDescriptionLabel = true;

  transformValue(value: any) {
    const safeValue = value ?? '';
    return upperFirst(safeValue);
  }
}
