import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { ListingType } from 'app/models';
import { DateFormatPipe } from 'app/pipes/date.pipe';
import { AdminListingService } from 'app/services/admin/admin-listing.service';
import { ListingDetailActionsComponent } from 'app/share/ui/admin/listing-detail-actions/listing-detail-actions.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { catchError, EMPTY, map, startWith, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-detail-wanted-listing',
  imports: [
    AdminLayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SpinnerComponent,
    ListingDetailActionsComponent,
    DateFormatPipe,
  ],
  templateUrl: './detail-wanted-listing.component.html',
  styleUrl: './detail-wanted-listing.component.scss',
  providers: [AdminListingService],
})
export class DetailWantedListingComponent {
  activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  adminListingService = inject(AdminListingService);
  snackBar = inject(MatSnackBar);
  listingId = this.activeRoute.snapshot.params['listingId'] as string;
  loadingListing = signal(true);
  listingDetailUpdator$ = new Subject<void>();

  mapCountryCodeToName = mapCountryCodeToName;

  listingDetail = toSignal(
    this.listingDetailUpdator$.pipe(
      startWith(0),
      tap(() => this.loadingListing.set(true)),
      switchMap(() => this.adminListingService.getDetail(this.listingId)),
      map((res) => res.data),
      catchError((err) => {
        this.snackBar.open('Something went wrong.');
        return EMPTY;
      }),
      tap((value) => {
        if (value.listing.listingType !== ListingType.WANTED) {
          this.router.navigateByUrl(ROUTES_WITH_SLASH.admin);
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
    console.log(this.listingId);
    console.log('todo: implement');
  }
}
