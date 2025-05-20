import { CompanyStatus } from 'app/models/auth.model';
import { OfferStatus } from 'app/models/offer';

interface Offer {
  id: number;
  createdAt: string;
  quantity: number;
  offeredPricePerUnit: number;
  totalPrice: number;
  status: OfferStatus;
  state: string;
  expiresAt: string | null;
  earliestDeliveryDate: string | null;
  latestDeliveryDate: string | null;
  currency: string | null;
  message: string | null;
  rejectionReason: string | null;
  incoterms: string | null;
  shippingPort: string | null;
  needsTransport: boolean;
  listingId: number;
  buyerCompanyId: number | null;
  buyerLocationId: number | null;
  buyerUserId: number | null;
  buyerCountry: string | null;
  sellerCompanyId: number;
  sellerLocationId: number | null;
  sellerUserId: number;
  sellerCountry: string | null;
  acceptedByUserId: number | null;
  rejectedByUserId: number | null;
  createdByUserId: number | null;
  updatedAt: string;
}

interface Listing {
  id: number;
  title: string;
  status: string;
  state: string;
  materialWeightWanted: number | null;
  quantity: number;
  remainingQuantity: number;
  materialPacking: string;
  materialType: string;
  numberOfOffers?: number;
  bestOffer?: number;
}

interface Company {
  id: number | null;
  name: string | null;
  country: string | null;
  status: CompanyStatus | null;
}

export interface OfferDetail {
  offer: Offer;
  listing: Listing;
  seller: {
    company: Company;
  };
  buyer: {
    company: Company;
  };
}

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

export type RequestCreateBidParams = {
  listingType: 'sell';
  listingId: number;
  companyId: number;
  locationId: number;
  createdByUserId: number;
  quantity: number;
  offeredPricePerUnit: number;
  currency: string;
  incoterms: string;
  shippingPort?: string;
  earliestDeliveryDate: string;
  latestDeliveryDate: string;
  expiresAt: string;
};
