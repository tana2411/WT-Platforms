import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminBuyerActivityComponent } from 'app/share/ui/admin/commercial/admin-buyer-activity/admin-buyer-activity.component';
import { AdminMemberComponent } from 'app/share/ui/admin/commercial/admin-member/admin-member.component';
import { AdminSellerActivityComponent } from 'app/share/ui/admin/commercial/admin-seller-activity/admin-seller-activity.component';
import { AdminWantedActivityComponent } from 'app/share/ui/admin/commercial/admin-wanted-activity/admin-wanted-activity.component';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-commercial-management',
  templateUrl: './commercial-management.component.html',
  styleUrls: ['./commercial-management.component.scss'],
  imports: [
    AdminLayoutComponent,
    MatTabsModule,
    AdminSellerActivityComponent,
    AdminBuyerActivityComponent,
    AdminWantedActivityComponent,
    AdminMemberComponent,
    MatIconModule,
  ],
})
export class CommercialManagementComponent {
  router = inject(Router);
  activeTab = signal(0);

  activeRoute = inject(ActivatedRoute);
  initTab = Number(this.activeRoute.snapshot.queryParams['tab'] ?? 0);
  location = inject(Location);

  onBack() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.admin);
  }

  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;
    this.activeTab.set(index);
    this.location.replaceState(this.router.url.split('?')[0], `?tab=${index}`);
  }
}
