import { Component, OnInit } from '@angular/core';
import { FilterComponent } from 'app/share/ui/listing/filter/filter.component';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
  imports: [FilterComponent, PaginationComponent, PurchaseDetailComponent],
})
export class PurchasesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
