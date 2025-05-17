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
  country: string;
  status: OfferStatus;
  bidAmount: string;
};

export type OfferListingItem = {
  id: number;
  date: string;
  buyerId: number;
  bidAmount: string;
  status: OfferStatus;
};
