import { Component, inject, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';

const ListTab = [
  {
    title: 'SELL MATERIAL',
    path: '/sell',
  },
  {
    title: 'LIST WANTED MATERIAL',
    path: 'wanted',
  },
] as const;
@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
  imports: [CommonLayoutComponent, MatTabsModule, RouterModule],
})
export class CreateListingComponent implements OnInit {
  selectedIndex = 0;
  listTab = ListTab;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    const child = this.activatedRoute.firstChild;
    const tabName = child?.snapshot.url[0]?.path;
    const routes: string[] = Object.values(this.listTab).map((tab) => tab.path);

    if (tabName) {
      const index = routes.indexOf(tabName);
      this.selectedIndex = index > -1 ? index : 0;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    const segment = this.listTab.find((t) => t.title == event.tab.textLabel);
    this.router.navigate([segment?.path], { relativeTo: this.activatedRoute });
  }
}
