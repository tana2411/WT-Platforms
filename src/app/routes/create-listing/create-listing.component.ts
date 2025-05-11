import { Component, OnInit } from '@angular/core';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ListWantedMaterialFormComponent } from './list-wanted-material-form/list-wanted-material-form.component';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
  imports: [
    CommonLayoutComponent,
    MatTabsModule,
    ListWantedMaterialFormComponent,
  ],
})
export class CreateListingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
