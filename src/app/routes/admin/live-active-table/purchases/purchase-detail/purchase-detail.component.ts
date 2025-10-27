import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { OfferState } from 'app/models/offer';
import { Purchase } from 'app/models/purchases.model';
import { getOfferStateColor, getOfferStatusColor } from 'app/share/utils/offer';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
  imports: [MatButtonModule, MatIconModule, TitleCasePipe, DatePipe, CurrencyPipe, TranslateModule],
})
export class PurchaseDetailComponent implements OnInit {
  @Input() purchase: Purchase | undefined = undefined;
  router = inject(Router);

  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;
  offerState = OfferState;

  getOfferStatusColor = getOfferStatusColor;
  getOfferStateColor = getOfferStateColor;

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

  getPackingName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.flatMap((type) => type.packing).find((packing) => packing.code == code)?.name ?? '';
  }

  onViewDetail() {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.adminBuyerActivityDetail}/${this.purchase?.offer.id}`);
  }

  mapOfferStateToLabel(state: OfferState) {
    switch (state) {
      case this.offerState.ACTIVE:
        return localized$('Active');
      case this.offerState.CLOSED:
        return localized$('Closed');
      case this.offerState.PENDING:
        return localized$('Pending');
    }
  }
}
