import { Component, OnInit } from '@angular/core';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';
import { FilterComponent } from 'app/share/ui/listing/filter/filter.component';
import { ProductGridComponent } from 'app/share/ui/listing/product-grid/product-grid.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { ListingFooterComponent } from 'app/share/ui/listing/listing-footer/listing-footer.component';

@Component({
  selector: 'app-wanted-material',
  templateUrl: './wanted-material.component.html',
  styleUrls: ['./wanted-material.component.scss'],
  imports: [
    CommonLayoutComponent,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent,
    ListingFooterComponent,
  ],
})
export class WantedMaterialComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onPageChange(page: number) {
    console.log(page);
  }

  onFilterChange(filterParams: any) {
    console.log(filterParams);
  }
}
