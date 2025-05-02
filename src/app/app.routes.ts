import { Routes } from '@angular/router';
import { UnAuthLayoutComponent } from './layout/un-auth-layout/un-auth-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { LoginPageComponent } from './routes/login-page/login-page.component';
import { TermComponent } from './routes/term/term.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';

export const routes: Routes = [
    {
        path: '',
        component: UnAuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
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
