import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ListingMaterial } from 'app/models';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  imports: [MatIconModule, ProductCardComponent],
})
export class ProductGridComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() totalItems: number = 10;
  @Input() hideResultCount: boolean = false;
  @Input() deletable: boolean = false;
  @Output() materialInterest = new EventEmitter();
  @Output() selectItem = new EventEmitter<any>();
  @Output() delete = new EventEmitter<ListingMaterial>();

  constructor() {}

  ngOnInit() {}
}
