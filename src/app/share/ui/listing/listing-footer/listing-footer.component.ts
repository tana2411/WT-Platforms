import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listing-footer',
  templateUrl: './listing-footer.component.html',
  styleUrls: ['./listing-footer.component.scss'],
  imports: [MatButtonModule],
})
export class ListingFooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
