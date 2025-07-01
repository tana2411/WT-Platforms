import { Location } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminCommercialService } from 'app/services/admin/admin-commercial.service';
import { filter } from 'rxjs';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-commercial-management',
  templateUrl: './commercial-management.component.html',
  styleUrls: ['./commercial-management.component.scss'],
  imports: [AdminLayoutComponent, MatTabsModule, MatIconModule, RouterModule],
  providers: [AdminCommercialService],
})
export class CommercialManagementComponent {
  router = inject(Router);
  activeTab = signal(0);
  selectedIndex = 0;
  destroyRef = inject(DestroyRef);

  activeRoute = inject(ActivatedRoute);
  initTab = Number(this.activeRoute.snapshot.queryParams['tab'] ?? 0);
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);

  listTabs = [
    { label: 'MEMBERS', path: 'members' },
    { label: 'SELLERS', path: 'sellers' },
    { label: 'BUYERS', path: 'buyers' },
    { label: 'WANTED', path: 'wanted' },
  ];

  ngOnInit() {
    this.selectedIndex = this.indexOfTab;
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.selectedIndex = this.indexOfTab;
      });
  }

  get indexOfTab(): number {
    const routes = Object.values(this.listTabs).map((tab) => tab.path);

    const child = this.activatedRoute.firstChild;
    const tabName = child?.snapshot.url[0]?.path;

    if (tabName) {
      return routes.indexOf(tabName);
    }
    return 0;
  }

  onBack() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.liveActiveTable);
  }

  onTabChange(event: MatTabChangeEvent) {
    const segment = this.listTabs[event.index].path;
    this.router.navigate([segment], { relativeTo: this.activatedRoute });
  }
}
