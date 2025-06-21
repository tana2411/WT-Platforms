import { CompanyStatus } from './auth.model';

export enum OfferStatus {
  ACCEPTED = 'accepted',
  SHIPPED = 'shipped',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum OfferState {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum OfferRequestActionEnum {
  ACCEPT = 'accept',
  REJECT = 'reject',
  REQUEST_INFORMATION = 'request_information',
}

export type TableSellingOfferItem = {
  id: number;
  date: string;
  materialName: string;
  quantity: number;
  country: string | null;
  status: OfferStatus;
  bidAmount: string;
  currency: string;
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
