export type ListingMemberItem = {
  user: {
    userId: number;
    companyId: number;
    name: string;
    companyType: string;
    companyName: string;
    companyCountry: string;
    registrationDate: string;
  };
  documents: CommercialDocument[]; // Updated type
  locations: Location[]; // Updated type
  onboardingStatus: string;
  registrationStatus: string;
  overallStatus: string;
};

export type MemberDetail = {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  prefix: string;
  jobTitle: string;
  phoneNumber: string;
  mobileNumber: string;
  isVerified: boolean;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  resetTokenExpiresAt: string | null;
  globalRole: 'user' | 'admin' | string;
  status: 'rejected' | 'pending' | 'approved' | string;
  notificationEmailEnabled: boolean;
  notificationPushEnabled: boolean;
  notificationInAppEnabled: boolean;
  whereDidYouHearAboutUs: string | null;
  username: string | null;
  receiveEmailForOffersOnMyListings: boolean;
  receiveEmailForNewMatchingListings: boolean;
  companyId: number;
  company: Company;
};

type Company = {
  id: number;
  countryCode: string | null;
  name: string;
  registrationNumber: string | null;
  vatNumber: string | null;
  vatRegistrationCountry: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  country: string;
  stateProvince: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  mobileNumber: string;
  companyType: string;
  isHaulier: boolean;
  fleetType: string | null;
  areasCovered: string | null;
  containerTypes: string | null;
  status: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  favoriteMaterials: string[] | null;
  companyInterest: string;
  boxClearingAgent: boolean;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  xUrl: string;
  description: string;
  locations: Location[];
  documents: CommercialDocument[];
};

export enum CompanyDocumentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUEST_INFORMATION = 'request_information',
}

export type CommercialDocument = {
  id: number;
  uploadedByUserId: number;
  reviewedByUserId: number;
  documentType: string;
  documentName: string;
  documentUrl: string;
  status: CompanyDocumentStatus;
  rejectionReason: string;
  reviewedAt: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  companyId: number;
};

type Location = {
  id: number;
  locationName: string;
  firstName: string;
  mainLocation?: boolean;
  lastName: string;
  positionInCompany: string;
  phoneNumber: string;
  postcode: string;
  city: string;
  country: string;
  stateProvince: string;
  officeOpenTime: string;
  officeCloseTime: string;
  loadingRamp: boolean;
  weighbridge: boolean | null;
  containerType: string[];
  selfLoadUnloadCapability: boolean;
  accessRestrictions: string | null;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  prefix: string;
  addressLine: string;
  street: string;
  acceptedMaterials: string | null;
  siteSpecificInstructions: string | null;
  sitePointContact: string | null;
  locationDocuments: Document[];
};

type Document = {
  id: number;
  uploadedByUserId: number;
  reviewedByUserId: number;
  documentType: string;
  documentName: string;
  documentUrl: string;
  status: string;
  rejectionReason: string;
  reviewedAt: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
};
