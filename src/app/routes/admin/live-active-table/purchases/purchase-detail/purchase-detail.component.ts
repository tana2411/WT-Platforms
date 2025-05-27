import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { Purchase } from 'app/models/purchases.model';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss'],
  imports: [MatButtonModule, MatIconModule, TitleCasePipe, DatePipe],
})
export class PurchaseDetailComponent implements OnInit {
  @Input() purchase: Purchase | undefined = undefined;

  mapCountryCodeToName = mapCountryCodeToName;
  materialTypes = materialTypes;

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
}
