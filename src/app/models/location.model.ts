import { IDocument } from './listing-material-detail.model';

export interface CompanyLocationDetail {
  id: number;
  locationName: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  positionInCompany: string;
  sitePointContact?: string;
  phoneNumber: string;
  addressLine: string;
  street?: string;
  postcode: string;
  city: string;
  country: string;
  stateProvince: string;
  officeOpenTime: string;
  officeCloseTime: string;
  loadingRamp: boolean;
  weighbridge: boolean | null;
  containerType: string[];
  selfLoadUnLoadCapability: boolean;
  accessRestrictions: string;
  siteSpecificInstructions: string;
  acceptedMaterials: string[] | null;
  otherMaterial: string;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  companyLocationDocuments: IDocument[];
}

export interface CompanyLocationResponse {
  totalCount: number;
  results: CompanyLocationDetail[];
}

export enum ContainerType {
  CurtainSiderStandard = 'curtain_slider_standard',
  ShippingContainer = 'shipping_container',
  WalkingFloor = 'walking_floor',
  TipperTrucks = 'tipperTrucks',
}

export const ContainerTypeList = [
  { name: 'Curtain Sider', value: ContainerType.CurtainSiderStandard },
  { name: 'Container', value: ContainerType.ShippingContainer },
  { name: 'Walking Floor', value: ContainerType.WalkingFloor },
  { name: 'Tipper trucks', value: ContainerType.TipperTrucks },
];

export interface UpdateCompanyLocationPayload extends Partial<CompanyLocationDetail> {}

export interface AddCompanyLocationResponse {
  status: string;
  message: string;
  data: {
    companyLocation: Omit<CompanyLocationDetail, 'companyLocationDocuments'>;
    companyLocationDocuments: IDocument[];
  };
}
