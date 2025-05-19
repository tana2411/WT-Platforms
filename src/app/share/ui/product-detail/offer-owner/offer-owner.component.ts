import { Component, computed, Input, signal } from '@angular/core';
import { mapCountryCodeToName } from '@app/statics';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { ListingMaterialDetailResponse } from 'app/models/listing-material-detail.model';
import moment from 'moment';

@Component({
  selector: 'app-offer-owner',
  imports: [IconComponent],
  templateUrl: './offer-owner.component.html',
  styleUrl: './offer-owner.component.scss',
})
export class OfferOwnerComponent {
  listingDetail$ = signal<ListingMaterialDetailResponse['data'] | undefined>(undefined);
  @Input({ required: true }) set listingDetail(val: ListingMaterialDetailResponse['data'] | undefined) {
    debugger;
    this.listingDetail$.set(val);
  }

  company = computed(() => this.listingDetail$()?.company);
  listing = computed(() => this.listingDetail$()?.listing);
  isSeller = computed(() => this.listing()?.listingType === 'sell');

  mapCountryCodeToName = mapCountryCodeToName;

  formatListedOn(time: string) {
    return moment(time).format('DD/MM/YYYY');
  }
}
