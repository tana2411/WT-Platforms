import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { SellListingDetail } from 'app/models';
import { getStateColor, getStatusColor } from 'app/share/utils/offer';

@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.scss'],
  imports: [MatIconModule, MatButtonModule, DatePipe, TitleCasePipe, DecimalPipe],
})
export class ListingDetailComponent implements OnInit {
  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;
  getStatusColor = getStatusColor;
  getStateColor = getStateColor;
  router = inject(Router);

  @Input() listing: SellListingDetail | undefined = undefined;

  constructor() {}

  ngOnInit() {}

  countryCodeToName(code: string | undefined | null): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }

  getMaterialName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.find((type) => type.code === code)?.name || '';
  }

  getWeight(weight: number | undefined | null) {
    if (weight) {
      return weight * 1000;
    }
    return '';
  }

  onViewDetail() {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.adminSaleListingDetail}/${this.listing!.id}`);
  }
}
