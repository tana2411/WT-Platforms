import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { TabContainerComponent } from 'app/routes/account-settings/tab-container/tab-container.component';
import { ListingsComponent } from './listings/listings.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { WantedComponent } from './wanted/wanted.component';

@Component({
  selector: 'app-live-active-table',
  templateUrl: './live-active-table.component.html',
  styleUrls: ['./live-active-table.component.scss'],
  imports: [
    AdminLayoutComponent,
    MatTabsModule,
    TabContainerComponent,
    PurchasesComponent,
    ListingsComponent,
    WantedComponent,
  ],
})
export class LiveActiveTableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
