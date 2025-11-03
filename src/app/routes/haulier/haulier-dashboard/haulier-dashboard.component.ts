import { Component } from '@angular/core';
import { CurrentOffersComponent } from 'app/common/current-offers/current-offers.component';

import { HaulierLayoutComponent } from 'app/layout/haulier-layout/haulier-layout.component';

@Component({
  selector: 'app-haulier-dashboard',
  templateUrl: './haulier-dashboard.component.html',
  styleUrls: ['./haulier-dashboard.component.scss'],
  imports: [CurrentOffersComponent, HaulierLayoutComponent],
})
export class HaulierDashboardComponent {}
