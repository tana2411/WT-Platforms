import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { User } from 'app/models/auth.model';
import { AuthService } from 'app/services/auth.service';
import { HeaderService } from 'app/services/header.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [IconComponent, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  user: Signal<User | undefined | null>;

  constructor(
    private authService: AuthService,
    public headerService: HeaderService,
  ) {
    this.user = toSignal(this.authService.user$);
  }

  listMenuPlatform = [
    {
      title: 'Buy Materials',
      link: ROUTES_WITH_SLASH.buy,
      icon: 'recycling',
      iconClass: 'highlight',
    },
    {
      title: 'Wanted Materials',
      link: ROUTES_WITH_SLASH.wanted,
      icon: 'notification_important',
      iconClass: 'highlight',
    },
    {
      title: 'Create Listing',
      link: ROUTES_WITH_SLASH.sell,
      icon: 'library_add',
      iconClass: 'highlight',
    },
    {
      title: 'My Listings',
      link: ROUTES_WITH_SLASH.saleListings,
      icon: 'library_books',
    },

    {
      title: 'My Offers',
      link: ROUTES_WITH_SLASH.myOffers,
      icon: 'ballot',
    },

    {
      title: 'My Sites',
      link: '//todo/my-site',
      icon: 'location_on',
    },

    {
      title: 'Add Locations',
      link: '//todo/add-location',
      icon: 'add_location',
    },
  ];
}
