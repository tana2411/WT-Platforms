import { Component, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { User } from 'app/models/auth.model';
import { AuthService } from 'app/services/auth.service';
import { HeaderService } from 'app/services/header.service';
import { Role } from 'app/types/auth';
import { isNil } from 'lodash';
import { first, map, startWith } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [IconComponent, MatIconModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  user: Signal<User | undefined | null>;
  Role = Role;

  private authService = inject(AuthService);

  openChildMenuIndex = signal<number | null>(null);

  listMenuPlatform = toSignal(
    this.authService.accountStatus.pipe(
      startWith(null),
      map((accountStatus) => {
        const notCompletedAccount = !!accountStatus?.showBanner;

        return [
          {
            title: localized$('Buy Materials'),
            link: ROUTES_WITH_SLASH.buy,
            icon: 'recycling',
            iconClass: 'highlight',
          },
          {
            title: localized$('Wanted Materials'),
            link: ROUTES_WITH_SLASH.wanted,
            icon: 'notification_important',
            iconClass: 'highlight',
          },
          {
            title: localized$('Create Listing'),
            icon: 'library_add',
            children: [
              {
                title: localized$('Sell Material'),
                link: ROUTES_WITH_SLASH.sell,
                disabled: notCompletedAccount,
                icon: 'ballot',
              },
              {
                title: localized$('List Wanted Material'),
                link: `${ROUTES_WITH_SLASH.sell}/wanted`,
                disabled: notCompletedAccount,
                icon: 'ballot',
              },
            ],
          },
          {
            title: localized$('My Listings'),
            icon: 'library_books',
            children: [
              {
                title: localized$('Wanted Listings'),
                link: ROUTES_WITH_SLASH.wantedListings,
                icon: 'ballot',
                disabled: false,
              },
              {
                title: localized$('Sales Listings'),
                link: ROUTES_WITH_SLASH.saleListings,
                icon: 'ballot',
                disabled: false,
              },
            ],
          },

          {
            title: localized$('My Offers'),
            icon: 'ballot',
            // icon: 'more-icon',
            children: [
              {
                title: localized$('Buyer'),
                link: ROUTES_WITH_SLASH.myOffersBuying,
                icon: 'ballot',
                disabled: false,
              },
              {
                title: localized$('Seller'),
                link: ROUTES_WITH_SLASH.myOffersSelling,
                icon: 'ballot',
                disabled: false,
              },
            ],
          },

          {
            title: localized$('My Sites'),
            link: ROUTES_WITH_SLASH.sites,
            icon: 'location_on',
          },
        ];
      }),
    ),
  );

  constructor(
    public headerService: HeaderService,
    private router: Router,
  ) {
    this.user = toSignal(this.authService.user$);

    this.router.events.pipe(first()).subscribe(() => {
      const currentUrl = this.router.url;
      const parentIndex = this.listMenuPlatform()?.findIndex((item) =>
        item.children?.some((child) => child.link === currentUrl),
      );

      if (isNil(parentIndex)) {
        return;
      }

      if (parentIndex !== -1) {
        this.openChildMenuIndex.set(parentIndex);
      } else {
        this.openChildMenuIndex.set(null);
      }
    });
  }

  adminMenu = [
    {
      title: localized$('Live Activity'),
      link: ROUTES_WITH_SLASH.liveActiveTable,
      icon: undefined,
      iconClass: 'highlight',
    },
    {
      title: localized$('Commercial Management'),
      link: ROUTES_WITH_SLASH.commercialManagement,
      icon: undefined,
      iconClass: 'highlight',
    },
  ];

  toggleChildMenu(index: number, item: any, event: any) {
    if (item.children) {
      this.openChildMenuIndex.update((v) => (v === null ? index : null));
      event.preventDefault();
    }
  }

  clickChildMenu(event: MouseEvent, item: any) {
    if (item.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.router.navigateByUrl(item.link);
  }

  toLandingPage() {
    this.router.navigate([ROUTES_WITH_SLASH.landingPage]);
  }
}
