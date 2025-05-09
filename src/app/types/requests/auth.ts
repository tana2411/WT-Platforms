import { Role } from '../auth';

export type RequestLoginParams = {
  email: string;
  password: string;
};

export type ResponseLogin = {
  data: {
    user: {
      id: number;
      email: string;
      accessToken: string;
      globalRole: string;
      isHaulier: boolean;
    };
  };
};

export type RequestForgotPasswordParams = {
  email: string;
};

export type RequestSetPasswordParams = {
  newPassword: string;
  confirmNewPassword: string;
  resetPasswordToken: string;
};

export type ResponseMe = {
  data: {
    companyUser: User;
  };
};

type Company = {
  id: number;
  countryCode: string | null;
  name: string;
  registrationNumber: string | null;
  vatNumber: string;
  vatRegistrationCountry: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  country: string;
  stateProvince: string;
  postalCode: string;
  website: string | null;
  phoneNumber: string;
  mobileNumber: string;
  companyType: string | null;
  favoriteMaterials: string[];
  materialInterest: string | null;
  isHaulier: boolean;
  fleetType: string | null;
  areasCovered: string | null;
  containerTypes: string | null;
  status: 'pending_verification' | 'verified' | 'rejected';
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserInfor = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  prefix: string;
  jobTitle: string;
  phoneNumber: string;
  mobileNumber: string;
  isVerified: boolean;
  verificationToken: string | null;
  resetTokenExpiresAt: string | null;
  globalRole: Role;
  status: 'active' | 'inactive';
  notificationEmailEnabled: boolean;
  notificationPushEnabled: boolean;
  notificationInAppEnabled: boolean;
  favoriteMaterials: string | null;
  companyInterest: string | null;
  whereDidYouHearAboutUs: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  companyRole: 'owner' | 'member';
  isPrimaryContact: boolean;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  companyId: number;
  userId: number;
  company: Company;
  user: UserInfor;
};
