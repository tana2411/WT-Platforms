import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { TabContainerComponent } from '../account-settings/tab-container/tab-container.component';
import { ListWantedMaterialFormComponent } from './list-wanted-material-form/list-wanted-material-form.component';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
  imports: [CommonLayoutComponent, MatTabsModule, ListWantedMaterialFormComponent, TabContainerComponent],
})
export class CreateListingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
