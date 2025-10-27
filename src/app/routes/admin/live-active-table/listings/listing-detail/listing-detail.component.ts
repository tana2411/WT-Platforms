import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { ListingState, ListingStatus, SellListingDetail } from 'app/models';
import {
  getCurrencySignal,
  getListingStateColor,
  getListingStatusColor,
  getOfferStateColor,
  getOfferStatusColor,
} from 'app/share/utils/offer';
@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.scss'],
  imports: [MatIconModule, MatButtonModule, DatePipe, TitleCasePipe, DecimalPipe, TranslateModule],
})
export class ListingDetailComponent implements OnInit {
  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;
  getOfferStatusColor = getOfferStatusColor;
  getOfferStateColor = getOfferStateColor;
  getListingStatusColor = getListingStatusColor;
  getListingStateColor = getListingStateColor;
  getCurrencySignal = getCurrencySignal;
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

  getListingStatusText(status?: ListingStatus | null): string {
    if (status == null) return '';

    switch (status) {
      case ListingStatus.AVAILABLE:
        return localized$('available');
      case ListingStatus.PENDING:
        return localized$('pending');
      case ListingStatus.SOLD:
        return localized$('sold');
      case ListingStatus.REJECTED:
        return localized$('rejected');
      default:
        return '';
    }
  }

  getListingStateText(status?: ListingState | null): string {
    if (status == null) return '';

    switch (status) {
      case ListingState.APPROVED:
        return localized$('approved');
      case ListingState.PENDING:
        return localized$('pending');
      case ListingState.REJECTED:
        return localized$('rejected');
      default:
        return '';
    }
  }
}
