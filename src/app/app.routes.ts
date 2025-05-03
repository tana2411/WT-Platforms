import { Routes } from '@angular/router';
import { UnAuthLayoutComponent } from './layout/un-auth-layout/un-auth-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { TermComponent } from './routes/term/term.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';
import {
  CanActivateAuthPage,
  CanActivateUnAuthPage,
} from './guards/auth/auth.guard';
import { ROUTES } from './constants/route.const';
import {} from './guards/auth/utils';
import { GuardRequireRole } from './types/auth';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [CanActivateUnAuthPage],
    component: UnAuthLayoutComponent,
    children: [
      {
        path: ROUTES.login,
        loadComponent: () =>
          import('./routes/login-page/login-page.component').then(
            (m) => m.LoginPageComponent,
          ),
      },
      {
        path: 'trading-platform-form',
        component: TradingFlatformFormComponent,
      },
      {
        path: 'haulage-form',
        component: HaulageFormComponent,
      },
    ],
  },
  {
    path: '',
    // canActivate: [CanActivateAuthPage],
    component: AuthLayoutComponent,
    children: [
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
          import(
            './routes/admin/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
      },
      // {
      //     path: 'codeshare-rbd-map',
      //     loadChildren: () =>
      //         import('./features/codeshare-rbd-map-bundle.module').then((m) => m.CodeshareRbdMapBundleModule),
      // },
      { path: '**', pathMatch: 'full', redirectTo: 'buy' },
    ],
  },
  {
    path: '',
    component: UnAuthLayoutComponent,
    children: [
      {
        path: 'termsandconditions',
        component: TermComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyComponent,
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
