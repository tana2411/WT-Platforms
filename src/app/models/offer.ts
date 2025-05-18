import { CompanyStatus } from 'app/types/requests/auth';

export enum OfferStatus {
  pending = 'Pending',
  accepted = 'Accepted',
  rejected = 'Rejected',
}

export type TableOfferItem = {
  id: number;
  date: string;
  materialName: string;
  quantity: number;
  country: string | null;
  status: OfferStatus;
  bidAmount: string;
};

export type OfferListingItem = {
  id: number;
  date: string;
  buyerId: number | null;
  bidAmount: string;
  status: OfferStatus;
  buyerStatus: CompanyStatus | null;
};
