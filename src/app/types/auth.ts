export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export type User = {
  id: number;
  email: string;
  accessToken: string;
  globalRole: Role;
  isHaulier: boolean;
};

export enum GuardRequireRole {
  SuperAdmin = 'super_admin',
  Haulier = 'haulier',
  Trading = 'trading',
}
