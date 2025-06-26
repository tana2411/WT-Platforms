import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { filter, map, switchMap } from 'rxjs';
import { ListWantedMaterialFormComponent } from './list-wanted-material-form/list-wanted-material-form.component';
import { SellLisingMaterialFormComponent } from './sell-lising-material-form/sell-lising-material-form.component';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
  imports: [
    CommonLayoutComponent,
    MatTabsModule,
    RouterModule,
    TranslateModule,
    SellLisingMaterialFormComponent,
    ListWantedMaterialFormComponent,
  ],
})
export class CreateListingComponent implements OnInit {
  type: 'sell' | 'wanted' = 'sell';

  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let currentRoute: ActivatedRoute = this.route;
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }
          return currentRoute;
        }),
        switchMap((child: ActivatedRoute) => child.data),
        takeUntilDestroyed(),
      )
      .subscribe((data: Data) => {
        this.type = data['type'] ?? 'sell';
      });
  }

  ngOnInit() {}
}
