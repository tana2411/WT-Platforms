import { Component } from '@angular/core';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { FilterComponent } from '../../share/ui/listing/filter/filter.component';
import { ProductGridComponent } from '../../share/ui/listing/product-grid/product-grid.component';
import { PaginationComponent } from '../../share/ui/listing/pagination/pagination.component';
import { ListingFooterComponent } from '../../share/ui/listing/listing-footer/listing-footer.component';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss'],
  imports: [
    CommonLayoutComponent,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent,
    ListingFooterComponent,
  ],
})
export class MarketPlaceComponent {
  constructor() {}

  onPageChange(page: number) {
    console.log(page);
  }

  onFilterChange(filterParams: any) {
    console.log(filterParams);
  }
}
