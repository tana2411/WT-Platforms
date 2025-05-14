export interface ListingWantedMaterialPayload {
  companyId: number;
  materialType: string;
  materialItem: string;
  materialForm: string;
  materialGrading: string;
  materialColor: string;
  materialFinishing: string;
  materialPacking: string;
  country: string;
  listingType: 'wanted' | 'sell';
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
