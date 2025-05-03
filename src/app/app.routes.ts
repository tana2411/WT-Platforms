import { Routes } from '@angular/router';
import { UnAuthLayoutComponent } from './layout/un-auth-layout/un-auth-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './routes/login/login.component';
import { TradingFlatformFormComponent } from './routes/registrations/trading-flatform-form/trading-flatform-form.component';
import { HaulageFormComponent } from './routes/registrations/haulage-form/haulage-form.component';
import { RegistrationPendingResultComponent } from './routes/registrations/registration-pending-result/registration-pending-result.component';
import { RegistrationCompleteResultComponent } from './routes/registrations/registration-complete-result/registration-complete-result.component';
import { CompanyInformationSectionComponent } from './routes/registrations/company-information-section/company-information-section.component';
import { CompanyDocumentComponent } from './routes/registrations/company-document/company-document.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
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
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
