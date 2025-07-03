import { CompanyLocation } from 'app/models';
import { User } from 'app/models/auth.model';
import { IDocument } from 'app/models/listing-material-detail.model';

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
  status: string;
  message: string;
  data: {
    companyUser: User;
    companyDocuments: IDocument[];
  };
};

export enum BannerType {
  INCOMPLETE_ONBOARDING = 'incomplete_onboarding',
  VERIFICATION_PENDING = 'verification_pending',
  VERIFICATION_FAILED = 'verification_failed',
}

export type ResponseAccountStatus = {
  status: string;
  message: string;
  data: {
    bannerType: BannerType;
    showBanner: boolean;
  };
};

export type ResquestGetCompanyLocationParams = {
  companyId: number;
  page: number;
  limit?: number;
};

export type ResponseGetCompanyLocation = {
  results: CompanyLocation[];
  totalCount: number;
};
