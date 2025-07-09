import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { AuthService } from 'app/services/auth.service';
import { BannerType } from 'app/types/requests/auth';
import { filter, map, switchMap, tap } from 'rxjs';
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
    MatSnackBarModule,
    SellLisingMaterialFormComponent,
    ListWantedMaterialFormComponent,
  ],
  providers: [TranslatePipe],
})
export class CreateListingComponent implements OnInit {
  type: 'sell' | 'wanted' = 'sell';

  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  snackbar = inject(MatSnackBar);
  translate = inject(TranslatePipe);

  loading = signal(true);

  constructor() {
    this.authService.accountStatus
      .pipe(
        filter((accountStatus) => !!accountStatus),
        tap((value) => {
          if (value.showBanner && !(BannerType as any)[value.bannerType]) {
            this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
            this.snackbar.open(
              this.translate.transform(localized$('Complete account to be able to sell and buy material seamlessly')),
            );
          } else {
            this.loading.set(!!value);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

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
