import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
  imports: [MatButtonModule],
})
export class PurchaseDetailComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
