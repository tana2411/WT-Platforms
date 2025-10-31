import { Component } from '@angular/core';
import { CurrentOffersComponent } from 'app/common/current-offers/current-offers.component';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';

@Component({
  selector: 'app-haulier-dashboard',
  templateUrl: './haulier-dashboard.component.html',
  styleUrls: ['./haulier-dashboard.component.scss'],
  imports: [CommonLayoutComponent, AdminLayoutComponent, CurrentOffersComponent],
})
export class HaulierDashboardComponent {}
