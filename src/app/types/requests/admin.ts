import { ListingMaterial } from 'app/models';
import { OfferState, OfferStatus } from 'app/models/offer';

// interface Listing {
//   id: number;
//   materialType: string;
//   materialItem: string;
//   materialGrading: string;
//   materialForm: string;
//   materialPacking: string;
//   materialFlowIndex: string;
//   materialWeightWanted: number;
//   capacityPerMonth: number;
//   currency: string;
//   startDate: string;
//   listingDuration: string;
//   listingRenewalPeriod: string;
//   additionalNotes: string;
//   status: string;
//   state: string;
//   createdAt: string;
//   updatedAt: string;
//   companyId: number;
//   createdByUserId: number;
//   listingType: string;
//   country: string;
//   wasteStoration: string;
// }

interface SellerInformation {
  fullName: string;
  company: string;
}

interface MaterialInformation {
  materialName: string;
  country: string;
  currency: string;
  packaging: string;
  capacityPerMonth: number;
  materialWeightWanted: number;
  materialWeightPerUnit?: number;
  quantity: 15;
  remainingQuantity?: number;
}

interface BidStatus {
  status: OfferStatus;
  state: OfferState;
}

export interface GetListingDetailResponse {
  status: string;
  data: {
    listing: ListingMaterial;
    sellerInformation: SellerInformation;
    materialInformation: MaterialInformation;
    userInformation: {
      fullName: string;
      company: string;
    };
    bidStatus: BidStatus;
  };
  message: string;
}
