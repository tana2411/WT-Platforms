import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { Purchase } from 'app/models/purchases.model';
import { getStateColor, getStatusColor } from 'app/share/utils/offer';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
  imports: [MatButtonModule, MatIconModule, TitleCasePipe, DatePipe, CurrencyPipe],
})
export class PurchaseDetailComponent implements OnInit {
  @Input() purchase: Purchase | undefined = undefined;
  router = inject(Router);

  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;

  getStatusColor = getStatusColor;
  getStateColor = getStateColor;

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
}
