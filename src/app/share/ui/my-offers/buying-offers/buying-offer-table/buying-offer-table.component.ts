import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FallbackImageDirective } from '@app/directives';
import { TableBuyingOfferItem } from 'app/models/offer';
import { getOfferStatusColor } from 'app/share/utils/offer';
import { PaginationComponent } from '../../../listing/pagination/pagination.component';

@Component({
  selector: 'app-buying-offer-table',
  imports: [PaginationComponent, MatButtonModule, RouterModule, FallbackImageDirective, TitleCasePipe],
  templateUrl: './buying-offer-table.component.html',
  styleUrl: './buying-offer-table.component.scss',
})
export class BuyingOfferTableComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Input() items: TableBuyingOfferItem[] = [];
  @Output() pageChange = new EventEmitter<number>();

  getOfferStatusColor = getOfferStatusColor;

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
