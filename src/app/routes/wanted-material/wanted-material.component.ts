import { Component, OnInit } from '@angular/core';
import { Product, ProductStatus } from 'app/models/product.model';
import { FilterComponent } from 'app/share/ui/listing/filter/filter.component';
import { ListingFooterComponent } from 'app/share/ui/listing/listing-footer/listing-footer.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { ProductGridComponent } from 'app/share/ui/listing/product-grid/product-grid.component';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';

@Component({
  selector: 'app-wanted-material',
  templateUrl: './wanted-material.component.html',
  styleUrls: ['./wanted-material.component.scss'],
  imports: [CommonLayoutComponent, FilterComponent, ProductGridComponent, PaginationComponent, ListingFooterComponent],
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

  products: Product[] = [
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Available,
      fromDate: '2025-05-12T10:35:47.353Z',
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Required,
      fromDate: '2025-05-12T10:35:47.353Z',
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Available,
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Required,
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Sold,
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Expired,
    },
    {
      name: 'HDPE Reels - Natural',
      location: 'Norway',
      averaWeightPerLoad: '350MT',
      imageSrc: '',
      status: ProductStatus.Ongoing,
    },
  ];
}
