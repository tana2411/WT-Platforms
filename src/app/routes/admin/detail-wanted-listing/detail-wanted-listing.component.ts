import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { AdminLayoutComponent } from 'app/layout/admin-layout/admin-layout.component';
import { DateFormatPipe } from 'app/pipes/date.pipe';
import { AdminListingService } from 'app/services/admin/admin-listing.service';
import { ListingDetailActionsComponent } from 'app/share/ui/admin/listing-detail-actions/listing-detail-actions.component';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { catchError, EMPTY, finalize, map } from 'rxjs';

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
  adminListingService = inject(AdminListingService);
  snackBar = inject(MatSnackBar);
  listingId = this.activeRoute.snapshot.params['listingId'] as string;
  loadingListing = signal(true);

  mapCountryCodeToName = mapCountryCodeToName;

  listingDetail = toSignal(
    this.adminListingService.getDetail(this.listingId).pipe(
      map((res) => res.data),
      catchError((err) => {
        this.snackBar.open('Something went wrong.');
        return EMPTY;
      }),
      finalize(() => {
        this.loadingListing.set(false);
      }),
      takeUntilDestroyed(),
    ),
  );

  onBack() {
    console.log(this.listingId);
    console.log('todo: implement');
  }
}
