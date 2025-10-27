import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { ListingStatus, ListingType } from 'app/models';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { AuthService } from 'app/services/auth.service';
import { ListingService } from 'app/services/listing.service';
import { ConfirmModalComponent, ConfirmModalProps } from 'app/share/ui/confirm-modal/confirm-modal.component';
import { isNil } from 'lodash';
import { catchError, EMPTY, finalize, map } from 'rxjs';
import { BiddingFormComponent, BiddingFormProps } from '../bidding-form/bidding-form.component';
import { RequestInformationComponent } from '../request-information/request-information.component';

@Component({
  selector: 'app-material-action',
  templateUrl: './material-action.component.html',
  styleUrl: './material-action.component.scss',
  imports: [MatDialogModule, MatButtonModule, RouterModule, CommonModule, TranslateModule],
  providers: [TranslatePipe],
})
export class MaterialActionComponent {
  @Input({ required: true }) isSeller: boolean = false;
  @Output() refresh = new EventEmitter<void>();
  listingDetail = input<ListingMaterialDetail | undefined>();

  dialog = inject(MatDialog);
  router = inject(Router);
  listingService = inject(ListingService);
  destroyRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  auth = inject(AuthService);
  activeRoute = inject(ActivatedRoute);
  translate = inject(TranslatePipe);

  deleting = signal(false);
  fulfilling = signal(false);
  solding = signal(false);
  userId = toSignal(this.auth.user$.pipe(map((user) => user?.userId)));
  isOwnListing = computed(() => this.userId() === this.listingDetail()?.listing.createdByUserId);

  canSold = computed(() => {
    return this.listingDetail()?.listing.status === ListingStatus.AVAILABLE;
  });

  canFulfill = computed(() => {
    return this.listingDetail()?.listing.status === ListingStatus.AVAILABLE;
  });

  onBid() {
    const dialogRef = this.dialog.open(BiddingFormComponent, {
      maxWidth: '750px',
      width: '100%',
      panelClass: 'px-3',
      data: {
        listingId: this.listingDetail()?.listing?.id,
        availableQuantity: this.listingDetail()?.listing?.remainingQuantity,
      } as BiddingFormProps,
    });
  }

  onRequestInformation() {
    this.dialog
      .open(RequestInformationComponent, {
        maxWidth: '750px',
        width: '100%',
        panelClass: 'px-3',
        data: {
          listingId: this.listingDetail()?.listing.id,
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onDeleteListing() {
    const listingId = this.listingDetail()?.listing?.id;

    if (isNil(listingId)) {
      return;
    }

    this.dialog
      .open<ConfirmModalComponent, ConfirmModalProps>(ConfirmModalComponent, {
        maxWidth: '500px',
        width: '100%',
        panelClass: 'px-3',
        data: {
          title: 'Are you sure you want to remove this listing? This action cannot be undone.',
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((shouldDelete) => {
        if (!shouldDelete) {
          return;
        }

        this.deleting.set(true);
        this.listingService
          .delete(listingId)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
              this.deleting.set(false);
            }),
            catchError((err) => {
              if (err?.error?.error?.statusCode == 403) {
                this.snackBar.open(
                  this.translate.transform(localized$('You do not have permission to remove this listing.')),
                );
              } else {
                this.snackBar.open(
                  this.translate.transform(localized$('Failed to remove the listing. Please try again later.')),
                );
              }
              return EMPTY;
            }),
          )
          .subscribe((result) => {
            this.snackBar.open(this.translate.transform(localized$('Your listing has been successfully removed.')));

            const isMySaleListing =
              this.isOwnListing() && this.listingDetail()?.listing.listingType === ListingType.SELL;
            if (isMySaleListing) {
              this.router.navigateByUrl(ROUTES_WITH_SLASH.saleListings);
            } else {
              this.router.navigateByUrl(ROUTES_WITH_SLASH.wanted);
            }
          });
      });
  }

  onEditListing() {}

  onFulfill() {
    const listingId = this.listingDetail()?.listing?.id;

    if (isNil(listingId)) {
      return;
    }
    this.fulfilling.set(true);

    this.listingService
      .sold(listingId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.fulfilling.set(false);
        }),
        catchError((err) => {
          if (err?.error?.error?.statusCode == 403) {
            this.snackBar.open(
              this.translate.transform(localized$('You do not have permission to mark fulfill this listing.')),
            );
          } else {
            this.snackBar.open(
              this.translate.transform(localized$('Failed to mark fulfill the listing. Please try again later.')),
            );
          }
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.snackBar.open(this.translate.transform(localized$('Your listing has been successfully fulfilled.')));
        this.refresh.emit();
      });
  }

  onSold() {
    const listingId = this.listingDetail()?.listing?.id;

    if (isNil(listingId)) {
      return;
    }
    this.solding.set(true);

    this.listingService
      .sold(listingId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.solding.set(false);
        }),
        catchError((err) => {
          if (err?.error?.error?.statusCode == 403) {
            this.snackBar.open(
              this.translate.transform(localized$('You do not have permission to mark sold this listing.')),
            );
          } else {
            this.snackBar.open(
              this.translate.transform(localized$('Failed to mark sold the listing. Please try again later.')),
            );
          }
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.snackBar.open(this.translate.transform(localized$('Your listing has been successfully sold.')));
        this.refresh.emit();
      });
  }
}
