import { CompanyStatus } from './auth.model';

export enum OfferStatus {
  PENDING = 'pending',
  APPROVED = 'approved', // NEW: Admin approved, visible to seller
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  SHIPPED = 'shipped',
}

export enum OfferState {
  PENDING = 'pending', // Waiting for admin review
  ACTIVE = 'active', // Admin approved, seller can act
  CLOSED = 'closed', // Final state (accepted/rejected)
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
  state: OfferState;
  buyerStatus?: CompanyStatus;
};
