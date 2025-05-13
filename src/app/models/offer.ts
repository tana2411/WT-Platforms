export enum OfferStatus {
  pending = 'pending',
  accepted = 'pending',
  rejected = 'pending',
}

export type Offer = {
  id: string;
  date: string;
  materialName: string;
  quantity: string;
  country: string;
  status: OfferStatus;
  bidAmount: string;
};
