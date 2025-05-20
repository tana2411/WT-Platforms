import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FallbackImageDirective } from '@app/directives';
import { TableOfferItem } from 'app/models/offer';
import { PaginationComponent } from '../../listing/pagination/pagination.component';

@Component({
  selector: 'app-offer-table',
  imports: [PaginationComponent, MatButtonModule, RouterModule, FallbackImageDirective],
  templateUrl: './offer-table.component.html',
  styleUrl: './offer-table.component.scss',
})
export class OfferTableComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Input() items: TableOfferItem[] = [];
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
