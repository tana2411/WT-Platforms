import { CompanyLocationDetail, ListingDocument } from 'app/models';
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
  currency: string;
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
  sellerLocationId: number;
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
  materialWeightWanted: number;
  materialWeightPerUnit: number;
  materialFinishing?: string;
  materialItem?: string;
  materialForm?: string;
  quantity: number;
  remainingQuantity: number;
  materialPacking: string;
  materialType: string;
  numberOfOffers?: number;
  bestOffer?: number;
  bestOfferCurrency?: string;
  documents?: ListingDocument[];
  location: CompanyLocationDetail;
}

export interface OfferLocation {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

interface Company extends OfferLocation {
  id: number;
  name: string;
  status?: CompanyStatus;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface OfferDetail {
  offer: Offer;
  listing: Listing;
  seller: {
    company: Company;
    user: User;
    location: CompanyLocationDetail;
  };
  buyer: {
    company: Company;
    user: User;
    location: CompanyLocationDetail;
  };
}

export type RequestGetOffersParams = {
  listingId?: number;
  page: number;
  isSeller?: boolean;
};

export type RequestGetBuyingOffersResponse = {
  results: OfferDetail[];
  totalCount: number;
};

export type RequestGetSellingOffersResponse = {
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
