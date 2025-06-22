export enum ListingStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
  REJECTED = 'rejected',
}

export enum ListingState {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum ListingType {
  SELL = 'sell',
  WANTED = 'wanted',
}

export interface ListingMaterialPayload {
  companyId: number;
  materialType: string;
  materialItem: string;
  materialForm: string;
  materialGrading: string;
  materialColor: string;
  materialFinishing: string;
  materialPacking: string;
  country: string;
  listingType: ListingType;
  materialFlowIndex: string;
  additionalNotes: string;
  startDate: string;
  capacityPerMonth: number;
  materialWeightWanted: number;
  wasteStoration: string;
  listingRenewalPeriod: string;
  listingDuration: string;
  documents: any[];
}

export enum ListingImageType {
  FEATURE_IMAGE = 'feature_image',
  GALLERY_IMAGE = 'gallery_image',
  MATERIAL_SPECIFICATION_DATA = 'material_specification_data',
}

export interface FilterParams {
  skip: number;
  limit: number;
  where: {
    listingType?: 'sell' | 'wanted';
    country?: string[];
    materialType?: string[];
    materialItem?: string[];
    materialPacking?: string;
    wasteStoration?: string;
    showFullfilledListing?: boolean;
    searchTerm?: string;
  };
}

export interface ListingMaterial extends ListingMaterialPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId: number;
  title: string;
  description: string;
  quantity: number | null;
  remainingQuantity: number | null;
  materialWeightPerUnit: number | null;
  materialRemainInCountry: boolean;
  currency: string | null;
  endDate: string | null;
  status: ListingStatus;
  state: ListingState;
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number | null;
  documents: ListingDocument[];
  location_other: string;
  location_id: string;
}

export interface ListingDocument {
  id: number;
  createdAt: string;
  updatedAt: string;
  documentType: ListingImageType;
  documentUrl: string;
  listingId: number;
}

export interface ListingResponse {
  totalCount: number;
  results: ListingMaterial[];
}
