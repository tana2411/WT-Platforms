import { Component, signal } from '@angular/core';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonLayoutComponent],
})
export class AdminDashboardComponent {}
