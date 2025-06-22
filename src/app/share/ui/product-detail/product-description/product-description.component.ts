import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IconComponent } from 'app/layout/common/icon/icon.component';

type Item = {
  label: string;
  icon: string;
  color?: string;
  class?: string;
  value: any;
};

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss',
  imports: [IconComponent],
  providers: [TitleCasePipe],
})
export class ProductDescriptionComponent {
  @Input({ required: true }) items: Item[] = [];
  @Input() showMaterialDescriptionLabel = true;

  private titlecase = inject(TitleCasePipe);

  transformValue(value: any) {
    return this.titlecase.transform((value ?? '') + '');
  }
}
