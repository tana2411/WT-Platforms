import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'app/services/listing.service';
import { ListContainerComponent } from 'app/share/ui/list-container/list-container.component';
import { ListingDetailComponent } from './listing-detail/listing-detail.component';

const PAGE_SIZE = 20;

interface PageResult {
  results: any;
  totalCount: number;
}
@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
  imports: [ListContainerComponent, ListingDetailComponent],
})
export class ListingsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  listingsService = inject(ListingService);

  constructor() {}

  ngOnInit() {}
}
