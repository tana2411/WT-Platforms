import { ListingMaterial } from 'app/models';
import { ListingMemberItem, MemberDetail } from 'app/models/admin/commercial.model';
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

export enum ListingRequestActionEnum {
  ACCEPT = 'accept',
  REJECT = 'reject',
  REQUEST_INFORMATION = 'request_information',
}

export interface ListingActionParams {
  rejectionReason?: string;
  message?: string;
}

export interface GetMembersParams {
  page: number;
  pageSize: number;
}

export type GetMembersResponse = {
  data: ListingMemberItem[];
  total: number;
};

export type GetMemberDetailResponse = {
  status: string;
  message: string;
  data: MemberDetail;
};

export type MemberRequestActionEnum = {
  ACCEPT: 'approve';
  REJECT: 'reject';
  REQUEST_INFORMATION: 'request_info';
};

export type MemberRequestActionParams = {
  reject_reason?: string;
  message?: string;
};
