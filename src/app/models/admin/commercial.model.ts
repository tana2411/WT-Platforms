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
  documents: any[]; // Replace `any` with actual document type if known
  locations: any[]; // Replace `any` with actual location type if known
  onboardingStatus: string;
  registrationStatus: string;
  overallStatus: string;
};

export type MemberDetail = {
  created_at: string;
  updated_at: string;
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  prefix: string;
  job_title: string;
  phone_number: string;
  mobile_number: string;
  is_verified: boolean;
  verification_token: string | null;
  reset_password_token: string | null;
  reset_token_expires_at: string | null;
  global_role: 'user' | 'admin' | string;
  status: 'rejected' | 'pending' | 'approved' | string;
  notification_email_enabled: boolean;
  notification_push_enabled: boolean;
  notification_in_app_enabled: boolean;
  where_did_you_hear_about_us: string | null;
  username: string | null;
  receive_email_for_offers_on_my_listings: boolean;
  receive_email_for_new_matching_listings: boolean;
  companyid: number;
  company: Company;
};

type Company = {
  id: number;
  country_code: string | null;
  name: string;
  registration_number: string | null;
  vat_number: string | null;
  vat_registration_country: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  country: string;
  state_province: string;
  postal_code: string;
  website: string;
  phone_number: string;
  mobile_number: string;
  company_type: string;
  is_haulier: boolean;
  fleet_type: string | null;
  areas_covered: string | null;
  container_types: string | null;
  status: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  favorite_materials: string[] | null;
  company_interest: string;
  box_clearing_agent: boolean;
  email: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  x_url: string;
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
  uploaded_by_user_id: number;
  reviewed_by_user_id: number;
  document_type: string;
  document_name: string;
  document_url: string;
  status: CompanyDocumentStatus;
  rejection_reason: string;
  reviewed_at: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  companyid: number;
};

type Location = {
  id: number;
  location_name: string;
  first_name: string;
  main_location?: boolean;
  last_name: string;
  position_in_company: string;
  phone_number: string;
  postcode: string;
  city: string;
  country: string;
  state_province: string;
  office_open_time: string;
  office_close_time: string;
  loading_ramp: boolean;
  weighbridge: boolean | null;
  container_type: string[];
  self_load_unload_capability: boolean;
  access_restrictions: string | null;
  created_at: string;
  updated_at: string;
  companyid: number;
  prefix: string;
  address_line: string;
  street: string;
  accepted_materials: string | null;
  site_specific_instructions: string | null;
  site_point_contact: string | null;
  location_documents: Document[];
};

type Document = {
  id: number;
  uploaded_by_user_id: number;
  reviewed_by_user_id: number;
  document_type: string;
  document_name: string;
  document_url: string;
  status: string;
  rejection_reason: string;
  reviewed_at: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
};
