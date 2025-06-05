import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { Location } from 'app/models';
import { ConfirmDeleteLocationModalComponent } from 'app/share/ui/confirm-delete-location-modal/confirm-delete-location-modal.component';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
  imports: [MatIconModule, MatButtonModule],
})
export class SiteListComponent implements OnInit {
  locations: Location[] = [
    {
      id: 1,
      addressLine1: '10 Downing Street',
      addressLine2: '',
      city: 'London',
      stateProvince: 'Greater London',
      postalCode: 'SW1A 2AA',
      country: 'GB',
    },
    {
      id: 2,
      addressLine1: '1600 Amphitheatre Parkway',
      city: 'Reading',
      stateProvince: 'Berkshire',
      postalCode: 'RG1 1AA',
      country: 'GB',
    },
    {
      id: 3,
      addressLine1: '1 High Street',
      addressLine2: 'Suite 5',
      city: 'Manchester',
      stateProvince: 'Greater Manchester',
      postalCode: 'M1 1AE',
      country: 'GB',
    },
    {
      id: 4,
      addressLine1: '50 Oxford Road',
      city: 'Cambridge',
      stateProvince: 'Cambridgeshire',
      postalCode: 'CB2 1PT',
      country: 'GB',
    },
    {
      id: 5,
      addressLine1: '25 Botolph Lane',
      city: 'London',
      stateProvince: 'Greater London',
      postalCode: 'EC3R 8AJ',
      country: 'GB',
    },
  ];

  dialog = inject(MatDialog);
  router = inject(Router);

  constructor() {}

  ngOnInit() {}

  onDeleteLocation(location: Location, index: number) {
    this.dialog.open(ConfirmDeleteLocationModalComponent, {
      maxWidth: '400px',
      width: '100%',
      panelClass: 'px-3',
      data: {
        location,
        index,
      },
    });
  }

  onViewDetail(location: Location) {
    this.router.navigate([ROUTES_WITH_SLASH.sites, location.id]);
  }

  addNewLocation(): void {
    this.router.navigate([ROUTES_WITH_SLASH.sites, 'add']);
  }
}
