import { Component, computed, Input, signal } from '@angular/core';
import { mapCountryCodeToName } from '@app/statics';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import moment from 'moment';

@Component({
  selector: 'app-material-owner',
  imports: [IconComponent],
  templateUrl: './material-owner.component.html',
  styleUrl: './material-owner.component.scss',
})
export class MaterialOwnerComponent {
  listingDetail$ = signal<ListingMaterialDetail | undefined>(undefined);
  @Input({ required: true }) set listingDetail(val: ListingMaterialDetail | undefined) {
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
