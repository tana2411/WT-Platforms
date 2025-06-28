import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { WantedListingDetail } from 'app/models/wanted.model';
import { getListingStateColor, getListingStatusColor } from 'app/share/utils/offer';

@Component({
  selector: 'app-wanted-detail',
  templateUrl: './wanted-detail.component.html',
  styleUrls: ['./wanted-detail.component.scss'],
  imports: [DatePipe, TitleCasePipe, MatIconModule, MatButtonModule, TranslateModule, DecimalPipe],
})
export class WantedDetailComponent implements OnInit {
  @Input() wanted: WantedListingDetail | undefined = undefined;
  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;
  getListingStateColor = getListingStateColor;
  getListingStatusColor = getListingStatusColor;

  router = inject(Router);

  constructor() {}

  ngOnInit() {}

  countryCodeToName(code: string | undefined | null): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }

  getPackingName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.flatMap((type) => type.packing).find((packing) => packing.code == code)?.name ?? '';
  }

  getMaterialName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.find((type) => type.code === code)?.name || '';
  }

  onViewDetail() {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.adminWantedListingDetail}/${this.wanted!.id}`);
  }
}
