import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Offer } from 'app/models/offer';
import { PaginationComponent } from '../../listing/pagination/pagination.component';

@Component({
  selector: 'app-offer-table',
  imports: [PaginationComponent, MatButtonModule],
  templateUrl: './offer-table.component.html',
  styleUrl: './offer-table.component.scss',
})
export class OfferTableComponent {
  @Input() totalItems: number = 0;
  @Input() items: Offer[] = [];

  onPageChange(page: number) {
    console.log(page);
  }
}
