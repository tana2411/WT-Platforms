import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { AdminCompanyDocumentComponent } from '../../../share/ui/admin/member-detail/admin-company-document/admin-company-document.component';
import { AdminCompanyInformationComponent } from '../../../share/ui/admin/member-detail/admin-company-information/admin-company-information.component';
import { AdminMaterialPreferenceComponent } from '../../../share/ui/admin/member-detail/admin-material-preference/admin-material-preference.component';
import { AdminPersonalInformationComponent } from '../../../share/ui/admin/member-detail/admin-personal-information/admin-personal-information.component';
import { MemberDetailActionsComponent } from '../../../share/ui/admin/member-detail/member-detail-actions/member-detail-actions.component';
import { SpinnerComponent } from '../../../share/ui/spinner/spinner.component';

@Component({
  selector: 'app-member-detail',
  imports: [
    AdminLayoutComponent,
    SpinnerComponent,
    MatIconModule,
    AdminPersonalInformationComponent,
    AdminCompanyInformationComponent,
    AdminCompanyInformationComponent,
    AdminMaterialPreferenceComponent,
    MatTabsModule,
    MemberDetailActionsComponent,
    AdminCompanyDocumentComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {
  router = inject(Router);
  // route = inject(ActivatedRoute);
  // initTab = this.route.snapshot.queryParams['tab'] as string | undefined;

  loadingUser = signal(false);
  user = signal({});
  // activeTab = signal<number>(this.initTab ? parseInt(this.initTab) : 0);

  // onTabChange($event: { index: number }) {
  //   const tabIndex = $event.index;
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { tab: tabIndex },
  //     queryParamsHandling: 'merge',
  //   });
  //   this.activeTab.set(tabIndex);
  // }

  onBack() {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.commercialManagement}?tab=0`);
  }
}
