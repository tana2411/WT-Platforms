import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { AdminOfferService } from 'app/services/admin/admin-offer.service';
import { OfferDetailActionsComponent } from 'app/share/ui/admin/offer-detail-actions/offer-detail-actions.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { getCurrencyLabel, getCurrencySignal, getOfferStatusColor } from 'app/share/utils/offer';
import { catchError, EMPTY, map, startWith, Subject, switchMap, tap } from 'rxjs';

import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';

@Component({
  selector: 'app-detail-buyer-activity',
  imports: [
    AdminLayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SpinnerComponent,
    OfferDetailActionsComponent,
    TitleCasePipe,
    DecimalPipe,
    TranslateModule,
  ],
  providers: [AdminOfferService, TranslatePipe],
  templateUrl: './detail-buyer-activity.component.html',
  styleUrl: './detail-buyer-activity.component.scss',
})
export class DetailBuyerActivityComponent {
  getOfferStatusColor = getOfferStatusColor;

  activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  adminOfferService = inject(AdminOfferService);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslatePipe);
  offerId = this.activeRoute.snapshot.params['offerId'] as string;
  loadingOffer = signal(true);
  offerDetailUpdator$ = new Subject<void>();
  getCurrencySignal = getCurrencySignal;
  getCurrencyLabel = getCurrencyLabel;

  mapCountryCodeToName = mapCountryCodeToName;

  offerDetail = toSignal(
    this.offerDetailUpdator$.pipe(
      startWith(0),
      tap(() => this.loadingOffer.set(true)),
      switchMap(() => this.adminOfferService.getDetail(this.offerId)),
      map((res) => res.data),
      catchError((err) => {
        this.snackBar.open(this.translate.transform(localized$('Something went wrong.')));
        return EMPTY;
      }),
      tap((value) => {
        this.loadingOffer.set(false);
      }),
      takeUntilDestroyed(),
    ),
  );

  reloadOfferDetail() {
    this.offerDetailUpdator$.next();
  }

  onBack() {
    window.history.back();
    // this.router.navigateByUrl(`${ROUTES_WITH_SLASH.commercialManagement}?tab=2`);
  }
}
