import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listing-footer',
  templateUrl: './listing-footer.component.html',
  styleUrls: ['./listing-footer.component.scss'],
  imports: [MatButtonModule, RouterModule],
})
export class ListingFooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
