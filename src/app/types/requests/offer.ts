import { OfferStatus } from 'app/models/offer';

export type OfferDetail = {
  offer: {
    id: number;
    createdAt: string;
    quantity: number;
    totalPrice: number;
    pricePerUnit: number;
    status: OfferStatus;
    message: string | null;
    rejectionReason: string | null;
    sellerTotalAmount: number;
  };
  listing: {
    id: number;
    title: string | null;
    materialWeightPerUnit: string | null;
    status: OfferStatus;
    remainingQuantity: number | null;
    bestOffer: string;
    numberOfOffers: string;
  };
  buyerCompany: {
    id: number;
    name: string;
    country: string;
  };
  sellerCompany?: {
    id: number;
    name: string;
    country: string | null;
    status: string;
  };
};

export type RequestGetOffersParams = {
  listingId?: number;
  page: number;
  isSeller: boolean;
};

export type RequestGetOffersResponse = {
  results: OfferDetail[];
  totalCount: number;
};

export type RequestGetOfferDetailResponse = {
  data: OfferDetail;
  message: string;
  status: string;
};
