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

export type ResquestGetCompanyLocationParams = {
  companyId: number;
  page: number;
  limit?: number;
};

export type ResponseGetCompanyLocation = {
  results: CompanyLocation[];
  totalCount: number;
};
