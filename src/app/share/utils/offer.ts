import { materialTypes } from '@app/statics';
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
