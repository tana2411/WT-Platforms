import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from 'app/layout/common/icon/icon.component';

export type EmptyOfferButton = {
  label: string;
  type?: 'stroke';
  onClick: () => void;
};

@Component({
  selector: 'app-empty-offer',
  imports: [IconComponent, MatButtonModule],
  templateUrl: './empty-offer.component.html',
  styleUrl: './empty-offer.component.scss',
})
export class EmptyOfferComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() buttons: EmptyOfferButton[] = [];
}
