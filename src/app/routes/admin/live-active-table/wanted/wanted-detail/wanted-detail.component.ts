import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { WantedListingDetail } from 'app/models/wanted.model';
import { getStateColor, getStatusColor } from 'app/share/utils/offer';

@Component({
  selector: 'app-wanted-detail',
  templateUrl: './wanted-detail.component.html',
  styleUrls: ['./wanted-detail.component.scss'],
  imports: [DatePipe, TitleCasePipe, MatIconModule, MatButtonModule],
})
export class WantedDetailComponent implements OnInit {
  @Input() wanted: WantedListingDetail | undefined = undefined;
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

  getPackingName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.flatMap((type) => type.packing).find((packing) => packing.code == code)?.name ?? '';
  }

  getMaterialName(code?: string | null): string {
    if (!code) return '';
    return this.materialTypes.find((type) => type.code === code)?.name || '';
  }
}
