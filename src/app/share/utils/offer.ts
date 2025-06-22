import {
  mapCodeToMaterialFinishing,
  mapCodeToMaterialForm,
  mapCodeToMaterialItem,
  mapCountryCodeToName,
  materialTypes,
} from '@app/statics';
import { CompanyStatus, ListingState, ListingStatus } from 'app/models';
import { OfferState, OfferStatus } from 'app/models/offer';
import { OfferLocation } from 'app/types/requests/offer';

export const getLocationAddress = (location: OfferLocation) => {
  return `${location.addressLine1}, ${location.city}, ${location.country ? mapCountryCodeToName[location.country] : ''}`;
};

export const formatDecimalNumber = (number: number): string => {
  return Number.isInteger(number) ? number.toString() : number.toFixed(2).replace(/\.?0+$/, '');
};

export const getMaterialTypeLabel = (type: string) => {
  return materialTypes.find((i) => i.code === type)?.name;
};

export const getOfferStateColor = (state: OfferState) => {
  switch (state) {
    case OfferState.ACTIVE:
      return '#03985C';
    case OfferState.CLOSED:
      return '#D75A66';
    case OfferState.PENDING:
      return '#F9A52B';
    default:
      return '#03985C';
  }
};

export const getOfferStatusColor = (state: OfferStatus) => {
  switch (state) {
    case OfferStatus.ACCEPTED:
      return '#03985C';
    case OfferStatus.REJECTED:
      return '#D75A66';
    case OfferStatus.PENDING:
      return '#F9A52B';
    default:
      return '#03985C';
  }
};

export const getListingStateColor = (state: ListingState) => {
  switch (state) {
    case ListingState.APPROVED:
      return '#03985C';
    case ListingState.REJECTED:
      return '#D75A66';
    case ListingState.PENDING:
      return '#F9A52B';
    default:
      return '#03985C';
  }
};

export const getListingStatusColor = (state: ListingStatus) => {
  switch (state) {
    case ListingStatus.SOLD:
    case ListingStatus.AVAILABLE:
      return '#03985C';
    case ListingStatus.REJECTED:
      return '#D75A66';
    case ListingStatus.PENDING:
      return '#000';
    default:
      return '#03985C';
  }
};

export const getCompanyStatusColor = (state?: CompanyStatus) => {
  switch (state) {
    case CompanyStatus.VERIFIED:
      return '#03985C';
    case CompanyStatus.REJECTED:
      return '#D75A66';
    case CompanyStatus.PENDING_VERIFICATION:
      return '#F9A52B';
    default:
      return '#03985C';
  }
};

export const getCompanyStatusLabel = (state?: CompanyStatus) => {
  switch (state) {
    case CompanyStatus.VERIFIED:
      return 'Verified';
    case CompanyStatus.REJECTED:
      return 'Rejected';
    case CompanyStatus.PENDING_VERIFICATION:
      return 'Pending Verification';
    default:
      return '';
  }
};

export const getCurrencySignal = (currency: string) => {
  switch (currency) {
    case 'gbp':
      return '£';
    case 'usd':
      return '$';
    case 'euro':
      return '€';
    default:
      return '';
  }
};

export const getCurrencyLabel = (currency: string) => {
  switch (currency) {
    case 'gbp':
      return 'Pound';
    case 'usd':
      return 'Usd';
    case 'euro':
      return 'Euro';
    default:
      return '';
  }
};

export const getListingTitle = (listing: {
  materialForm?: string;
  materialItem?: string;
  materialFinishing?: string;
}) => {
  const data = [
    mapCodeToMaterialItem[listing.materialItem ?? ''],
    mapCodeToMaterialForm[listing.materialForm ?? ''],
    mapCodeToMaterialFinishing[listing.materialFinishing ?? ''],
  ]
    .filter((i) => !!i)
    .join(' - ');

  return data;
};
