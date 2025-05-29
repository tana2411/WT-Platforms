import { Component, inject, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-live-active-table',
  templateUrl: './live-active-table.component.html',
  styleUrls: ['./live-active-table.component.scss'],
  imports: [AdminLayoutComponent, MatTabsModule, RouterModule],
})
export class LiveActiveTableComponent implements OnInit {
  selectedIndex = 0;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  tabPaths: Record<string, string> = {
    PURCHASES: 'purchases',
    LISTINGS: 'listings',
    WANTED: 'wanted',
  };

  constructor() {}

  ngOnInit() {
    const child = this.activatedRoute.firstChild;
    const tabName = child?.snapshot.url[0]?.path;
    const routes = Object.values(this.tabPaths);

    if (tabName) {
      const index = routes.indexOf(tabName);
      this.selectedIndex = index > -1 ? index : 0;
    } else {
      this.selectedIndex = 0;
      this.router.navigate([this.tabPaths['PURCHASES']], { relativeTo: this.activatedRoute });
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    const segment = this.tabPaths[event.tab.textLabel];
    this.router.navigate([segment], { relativeTo: this.activatedRoute });
  }
}
