import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminCommercialService } from 'app/services/admin/admin-commercial.service';
import { catchError, map, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { AdminCompanyDocumentComponent } from '../../../share/ui/admin/member-detail/admin-company-document/admin-company-document.component';
import { AdminCompanyInformationComponent } from '../../../share/ui/admin/member-detail/admin-company-information/admin-company-information.component';
import { AdminMaterialPreferenceComponent } from '../../../share/ui/admin/member-detail/admin-material-preference/admin-material-preference.component';
import { AdminMemberLocationComponent } from '../../../share/ui/admin/member-detail/admin-member-location/admin-member-location.component';
import { AdminPersonalInformationComponent } from '../../../share/ui/admin/member-detail/admin-personal-information/admin-personal-information.component';
import { MemberDetailActionsComponent } from '../../../share/ui/admin/member-detail/member-detail-actions/member-detail-actions.component';
import { SpinnerComponent } from '../../../share/ui/spinner/spinner.component';

@Component({
  selector: 'app-member-detail',
  imports: [
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,

    AdminLayoutComponent,
    SpinnerComponent,
    AdminPersonalInformationComponent,
    AdminCompanyInformationComponent,
    AdminCompanyInformationComponent,
    AdminMaterialPreferenceComponent,
    MemberDetailActionsComponent,
    AdminCompanyDocumentComponent,
    AdminMemberLocationComponent,
    TranslateModule,
  ],
  providers: [AdminCommercialService, TranslatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  memberId = this.route.snapshot.params['id'];
  loadingUser = signal(false);
  commercialService = inject(AdminCommercialService);
  snackBar = inject(MatSnackBar);
  updator = new Subject<void>();
  translate = inject(TranslatePipe);

  user = toSignal(
    this.updator.pipe(
      startWith(null), // Trigger initial load
      tap(() => this.loadingUser.set(true)),
      switchMap(() => this.commercialService.getMemberDetail(this.memberId)),
      catchError((error) => {
        this.snackBar.open(
          this.translate.transform(localized$('Unable to load member profile data. Please try again')),
        );
        console.error('Error fetching member detail:', error);
        return of({
          data: null,
        });
      }),
      map((res) => res.data),
      tap(() => this.loadingUser.set(false)),
    ),
  );

  onBack() {
    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.commercialManagement}?tab=0`);
  }

  refresh() {
    this.updator.next();
  }
}
