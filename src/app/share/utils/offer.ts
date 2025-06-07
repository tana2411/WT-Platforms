import { materialTypes } from '@app/statics';
import { OfferState, OfferStatus } from 'app/models/offer';
import { OfferLocation } from 'app/types/requests/offer';

export const getLocationAddress = (location: OfferLocation) => {
  return `${location.addressLine1} ${location.city} ${location.country}`;
};

export const formatDecimalNumber = (number: number): string => {
  return Number.isInteger(number) ? number.toString() : number.toFixed(2).replace(/\.?0+$/, '');
};

export const getMaterialTypeLabel = (type: string) => {
  return materialTypes.find((i) => i.code === type)?.name;
};

export const getStateColor = (state: OfferState) => {
  switch (state) {
    case OfferState.ACTIVE:
    case OfferState.APPROVED:
      return '#03985C';
    case OfferState.REJECTED:
      return '#D75A66';
    case OfferState.PENDING:
      return '#F9A52B';
    default:
      return '#03985C';
  }
};

export const getStatusColor = (state: OfferStatus) => {
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
