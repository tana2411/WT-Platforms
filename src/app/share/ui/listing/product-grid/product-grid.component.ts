import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  imports: [MatIconModule],
})
export class ProductGridComponent implements OnInit {
  @Input() items: any;
  @Input() totalItems: number = 10;
  @Output() materialInterest = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
