import { CompanyStatus } from './auth.model';

export enum OfferStatus {
  pending = 'Pending',
  accepted = 'Accepted',
  rejected = 'Rejected',
}

export type TableSellingOfferItem = {
  id: number;
  date: string;
  materialName: string;
  quantity: number;
  country: string | null;
  status: OfferStatus;
  bidAmount: string;
};

export type TableBuyingOfferItem = {
  id: number;
  materialName: string;
  quantity: number;
  status: OfferStatus;

  pickupLocation: string;
  destination: string;
  packaging: string;
  weightPerLoad: string;
};

export type OfferListingItem = {
  id: number;
  date: string;
  buyerId: number | null;
  bidAmount: string;
  status: OfferStatus;
  buyerStatus?: CompanyStatus;
};
