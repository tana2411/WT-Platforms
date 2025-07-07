import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { ListingType } from 'app/models';
import { AdminListingService } from 'app/services/admin/admin-listing.service';
import { ListingDetailActionsComponent } from 'app/share/ui/admin/listing-detail-actions/listing-detail-actions.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { getCurrencySignal, getListingStatusColor } from 'app/share/utils/offer';
import { catchError, EMPTY, map, startWith, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-detail-sale-listing',
  imports: [
    AdminLayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SpinnerComponent,
    ListingDetailActionsComponent,
    TitleCasePipe,
    DecimalPipe,
    TranslateModule,
  ],
  templateUrl: './detail-sale-listing.component.html',
  styleUrl: './detail-sale-listing.component.scss',
  providers: [AdminListingService, TranslatePipe],
})
export class DetailSaleListingComponent {
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  adminListingService = inject(AdminListingService);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslatePipe);
  listingId = this.activeRoute.snapshot.params['listingId'] as string;
  loadingListing = signal(true);
  listingDetailUpdator$ = new Subject<void>();

  getListingStatusColor = getListingStatusColor;
  getCurrencySignal = getCurrencySignal;

  mapCountryCodeToName = mapCountryCodeToName;

  listingDetail = toSignal(
    this.listingDetailUpdator$.pipe(
      startWith(0),
      tap(() => this.loadingListing.set(true)),
      switchMap(() => this.adminListingService.getDetail(this.listingId)),
      map((res) => res.data),
      catchError((err) => {
        this.snackBar.open(this.translate.transform(localized$('Something went wrong.')));
        return EMPTY;
      }),
      tap((value) => {
        if (value && value.listing.listingType !== ListingType.SELL) {
          this.router.navigateByUrl(ROUTES_WITH_SLASH.liveActiveTable);
        }
        this.loadingListing.set(false);
      }),
      takeUntilDestroyed(),
    ),
  );

  reloadListingDetail() {
    this.listingDetailUpdator$.next();
  }

  onBack() {
    window.history.back();
    // this.router.navigateByUrl(`${ROUTES_WITH_SLASH.commercialManagement}?tab=1`);
  }
}
