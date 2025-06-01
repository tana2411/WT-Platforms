import { Routes } from '@angular/router';
import { ROUTES } from './constants/route.const';
import { CanActivateAuthPage } from './guards/auth/auth.guard';
import {} from './guards/auth/utils';
import { AccountSettingComponent } from './routes/account-setting/account-setting.component';
import { LiveActiveTableComponent } from './routes/admin/live-active-table/live-active-table.component';
import { CreateListingComponent } from './routes/create-listing/create-listing.component';
import { LogoutComponent } from './routes/logout/logout.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';
import { CompanyDocumentComponent } from './routes/registrations/company-document/company-document.component';
import { CompanyInformationSectionComponent } from './routes/registrations/company-information-section/company-information-section.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { RegistrationCompleteResultComponent } from './routes/registrations/registration-complete-result/registration-complete-result.component';
import { RegistrationPendingResultComponent } from './routes/registrations/registration-pending-result/registration-pending-result.component';
import { SiteLocationSectionComponent } from './routes/registrations/site-location-section/site-location-section.component';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { TermComponent } from './routes/term/term.component';
import { GuardRequireRole } from './types/auth';

export const routes: Routes = [
  {
    path: ROUTES.login,
    // canActivate: [CanActivateUnAuthPage],
    loadComponent: () =>
      import('./routes/login-pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
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
      requireAuthParams: [GuardRequireRole.SuperAdmin, GuardRequireRole.Trading],
    },
    loadComponent: () => import('./routes/market-place/market-place.component').then((m) => m.MarketPlaceComponent),
  },
  {
    path: ROUTES.wanted,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin, GuardRequireRole.Trading],
    },
    loadComponent: () =>
      import('./routes/wanted-material/wanted-material.component').then((m) => m.WantedMaterialComponent),
  },
  {
    path: ROUTES.saleListings,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin, GuardRequireRole.Trading],
    },
    loadComponent: () => import('./routes/sale-listing/sale-listing.component').then((m) => m.SaleListingComponent),
  },
  {
    path: ROUTES.sell,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin, GuardRequireRole.Trading],
    },
    component: CreateListingComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/create-listing/sell-lising-material-form/sell-lising-material-form.component').then(
            (m) => m.SellLisingMaterialFormComponent,
          ),
      },
      {
        path: 'wanted',
        loadComponent: () =>
          import('./routes/create-listing/list-wanted-material-form/list-wanted-material-form.component').then(
            (m) => m.ListWantedMaterialFormComponent,
          ),
      },
    ],
  },
  {
    path: ROUTES.haulier,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin, GuardRequireRole.Haulier],
    },
    loadComponent: () =>
      import('./routes/haulier/haulier-dashboard/haulier-dashboard.component').then((m) => m.HaulierDashboardComponent),
  },
  {
    path: ROUTES.myOffersSelling,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.Trading, GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/my-offers-selling/my-offers-selling.component').then((m) => m.MyOffersSellingComponent),
  },
  {
    path: ROUTES.myOffersBuying,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.Trading, GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/my-offers-buying/my-offers-buying.component').then((m) => m.MyOffersBuyingComponent),
  },

  {
    path: `${ROUTES.offerDetail}/:offerId`,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.Trading, GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/my-offers-detail/my-offers-detail.component').then((m) => m.MyOffersDetailComponent),
  },

  {
    path: `${ROUTES.listingOfferDetail}/:offerId`,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.Trading, GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/listing-offers-detail/listing-offers-detail.component').then(
        (m) => m.ListingOffersDetailComponent,
      ),
  },
  {
    path: ROUTES.admin,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: ROUTES.liveActiveTable,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    component: LiveActiveTableComponent,
    children: [
      {
        path: 'purchases',
        loadComponent: () =>
          import('./routes/admin/live-active-table/purchases/purchases.component').then((m) => m.PurchasesComponent),
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./routes/admin/live-active-table/listings/listings.component').then((m) => m.ListingsComponent),
      },
      {
        path: 'wanted',
        loadComponent: () =>
          import('./routes/admin/live-active-table/wanted/wanted.component').then((m) => m.WantedComponent),
      },
    ],
  },
  {
    path: ROUTES.commercialManagement,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/admin/commercial-management/commercial-management.component').then(
        (m) => m.CommercialManagementComponent,
      ),
  },
  {
    path: `${ROUTES.adminSaleListingDetail}/:listingId`,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/admin/detail-sale-listing/detail-sale-listing.component').then(
        (m) => m.DetailSaleListingComponent,
      ),
  },
  {
    path: `${ROUTES.adminWantedListingDetail}/:listingId`,
    canActivate: [CanActivateAuthPage],
    data: {
      requireAuthParams: [GuardRequireRole.SuperAdmin],
    },
    loadComponent: () =>
      import('./routes/admin/detail-wanted-listing/detail-wanted-listing.component').then(
        (m) => m.DetailWantedListingComponent,
      ),
  },
  {
    path: ROUTES.settings,
    canActivate: [CanActivateAuthPage],
    component: AccountSettingComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./routes/account-settings/my-profile/my-profile.component').then((m) => m.MyProfileComponent),
      },
      {
        path: 'company-information',
        loadComponent: () => import('./routes/account-settings/info/info.component').then((m) => m.InfoComponent),
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./routes/account-settings/material/material.component').then((m) => m.MaterialComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./routes/account-settings/notification/notification.component').then((m) => m.NotificationComponent),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./routes/account-settings/document/document.component').then((m) => m.DocumentComponent),
      },
      {
        path: 'locations',
        loadComponent: () =>
          import('./routes/account-settings/location/location.component').then((m) => m.LocationComponent),
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
