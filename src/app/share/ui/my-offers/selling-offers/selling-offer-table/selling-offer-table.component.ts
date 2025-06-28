import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FallbackImageDirective } from '@app/directives';
import { TableSellingOfferItem } from 'app/models/offer';
import { getListingFeatureImage, getOfferStatusColor } from 'app/share/utils/offer';
import { PaginationComponent } from '../../../listing/pagination/pagination.component';

@Component({
  selector: 'app-selling-offer-table',
  imports: [PaginationComponent, MatButtonModule, RouterModule, FallbackImageDirective, TitleCasePipe, DecimalPipe],
  templateUrl: './selling-offer-table.component.html',
  styleUrl: './selling-offer-table.component.scss',
})
export class SellingOfferTableComponent {
  @Input() totalItems: number = 0;
  @Input() page: number = 1;
  @Input() items: TableSellingOfferItem[] = [];
  @Output() pageChange = new EventEmitter<number>();

  getOfferStatusColor = getOfferStatusColor;
  getListingFeatureImage = getListingFeatureImage;

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
