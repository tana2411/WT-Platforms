import { Routes } from '@angular/router';
import { UnAuthLayoutComponent } from './layout/un-auth-layout/un-auth-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './routes/logins/login/login.component';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { RegistrationPendingResultComponent } from './routes/registrations/registration-pending-result/registration-pending-result.component';
import { RegistrationCompleteResultComponent } from './routes/registrations/registration-complete-result/registration-complete-result.component';

export const routes: Routes = [
    {
        path: 'public',
        component: UnAuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'trading-platform-form',
                component: TradingFlatformFormComponent,
            },
            {
                path: 'haulage-form',
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
        ],
    },
    {
        path: '',
        // canActivate: [AuthGuard],
        component: AuthLayoutComponent,
        children: [
            // {
            //     path: 'dashboard',
            //     component: DashboardComponent,
            // },
            // {
            //     path: 'codeshare-rbd-map',
            //     loadChildren: () =>
            //         import('./features/codeshare-rbd-map-bundle.module').then((m) => m.CodeshareRbdMapBundleModule),
            // },
            { path: '**', pathMatch: 'full', redirectTo: 'dashboard' },
        ],
    },
    { path: '**', pathMatch: 'full', redirectTo: 'public/login' },
];
