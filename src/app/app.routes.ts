import { Routes } from '@angular/router';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { RegistrationPendingResultComponent } from './routes/registrations/registration-pending-result/registration-pending-result.component';
import { RegistrationCompleteResultComponent } from './routes/registrations/registration-complete-result/registration-complete-result.component';
import { CompanyInformationSectionComponent } from './routes/registrations/company-information-section/company-information-section.component';
import { CompanyDocumentComponent } from './routes/registrations/company-document/company-document.component';
import { LoginPageComponent } from './routes/login-pages/login-page/login-page.component';
import { TermComponent } from './routes/term/term.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';
import {
  CanActivateAuthPage,
  CanActivateUnAuthPage,
} from './guards/auth/auth.guard';
import { ROUTES } from './constants/route.const';
import {} from './guards/auth/utils';
import { GuardRequireRole } from './types/auth';
import { LogoutComponent } from './routes/logout/logout.component';
import { SiteLocationSectionComponent } from './routes/registrations/site-location-section/site-location-section.component';

export const routes: Routes = [
  {
    path: ROUTES.login,
    canActivate: [CanActivateUnAuthPage],
    loadComponent: () =>
      import('./routes/login-pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'termsandconditions',
    component: TermComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyComponent,
  },
  {
    path: 'create-account',
    component: TradingFlatformFormComponent,
  },
  {
    path: 'create-haulier-account',
    component: HaulageFormComponent,
  },
  {
    path: 'account-pending-result',
    component: RegistrationPendingResultComponent,
  },
  {
    path: 'account-complete-result',
    component: RegistrationCompleteResultComponent,
  },
  {
    path: 'company-information',
    component: CompanyInformationSectionComponent,
  },
  {
    path: 'company-document',
    component: CompanyDocumentComponent,
  },
  {
    path: 'site-location',
    component: SiteLocationSectionComponent,
  },
  {
    path: ROUTES.buy,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [
        GuardRequireRole.SuperAdmin,
        GuardRequireRole.Trading,
      ],
    },
    loadComponent: () =>
      import('./routes/market-place/market-place.component').then(
        (m) => m.MarketPlaceComponent,
      ),
  },
  {
    path: ROUTES.haulier,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [
        GuardRequireRole.SuperAdmin,
        GuardRequireRole.Haulier,
      ],
    },
    loadComponent: () =>
      import(
        './routes/haulier/haulier-dashboard/haulier-dashboard.component'
      ).then((m) => m.HaulierDashboardComponent),
  },
  {
    path: ROUTES.admin,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },

  {
    path: ROUTES.settings,
    canActivate: [CanActivateAuthPage],
    loadComponent: () =>
      import('./routes/account-setting/account-setting.component').then(
        (m) => m.AccountSettingComponent,
      ),
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
