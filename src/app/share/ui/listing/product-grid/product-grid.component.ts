import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  imports: [MatIconModule, IconComponent, ProductCardComponent],
})
export class ProductGridComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() totalItems: number = 10;
  @Output() materialInterest = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
