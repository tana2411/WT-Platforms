import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { User } from 'app/models/auth.model';
import { AuthService } from 'app/services/auth.service';
import { HeaderService } from 'app/services/header.service';
import { Role } from 'app/types/auth';
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
  constructor(
    private authService: AuthService,
    public headerService: HeaderService,
  ) {
    this.user = toSignal(this.authService.user$);
  }

  listMenuPlatform = [
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
      link: ROUTES_WITH_SLASH.sell,
      icon: 'library_add',
      iconClass: 'highlight',
    },
    {
      title: localized$('My Listings'),
      link: ROUTES_WITH_SLASH.saleListings,
      icon: 'library_books',
    },

    {
      title: localized$('My Offers Selling'),
      link: ROUTES_WITH_SLASH.myOffersSelling,
      icon: 'ballot',
    },

    {
      title: localized$('My Offers Buying'),
      link: ROUTES_WITH_SLASH.myOffersBuying,
      icon: 'ballot',
    },

    {
      title: localized$('My Sites'),
      link: ROUTES_WITH_SLASH.sites,
      icon: 'location_on',
    },
  ];

  adminMenu = [
    {
      title: localized$('Live Activity'),
      link: ROUTES_WITH_SLASH.liveActiveTable,
      icon: 'table_chart',
      iconClass: 'highlight',
    },
    {
      title: localized$('Commercial Management'),
      link: ROUTES_WITH_SLASH.commercialManagement,
      icon: 'business_center',
      iconClass: 'highlight',
    },
  ];
}
