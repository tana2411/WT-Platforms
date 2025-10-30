import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, Inject, output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslatePipe } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { NotificationItemComponent } from 'app/layout/notification/notification-item/notification-item.component';
import { NotificationType, NotiItem } from 'app/types/notification';
import { NotiResponseItem } from 'app/types/requests/notification';
import moment from 'moment';
import { catchError, delay, finalize, of, tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-menu',
  imports: [MatMenuModule, MatButtonModule, NotificationItemComponent, CommonModule, MatIcon],
  providers: [TranslatePipe],
  templateUrl: './notification-menu.component.html',
  styleUrl: './notification-menu.component.scss',
})
export class NotificationMenuComponent {
  @ViewChild('menu', { static: true }) menu!: MatMenu;
  @ViewChild('notiList', { static: true }) notiList!: ElementRef<HTMLDivElement>;

  reFetchNoti = output();

  private readonly perPage = 10;
  private notificationService = inject(NotificationService);
  private snackbar = inject(MatSnackBar);
  private translate = inject(TranslatePipe);
  private router = inject(Router);

  notifications = signal<NotiItem[] | undefined>(undefined);
  total = signal<number>(0);
  offset = signal(0);
  hasMoreNoti = computed(() => (this.notifications() ?? [])?.length < this.total());
  canViewMore = computed(() => this.hasMoreNoti() && this.total() > 10);

  loading = signal(false);
  maskAsReadLoading = signal(false);
  viewMoreLoading = signal(false);

  constructor(@Inject(MatMenu) private parentMenu: MatMenu) {
    this.initFetchNoti();
  }

  handleFetchNotifications() {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    return this.notificationService.getNotifications({ offset: this.offset() }).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
    );
  }

  initFetchNoti() {
    this.offset.set(0);
    this.handleFetchNotifications()
      ?.pipe(
        tap((res) => {
          const notiData = res.data.map((item) => this.transformNotiResToNotiItem(item));
          this.notifications.set(notiData);
        }),
        catchError(() => {
          this.snackbar.open('Failed to load notifications. Please refresh the page.');
          return of([]);
        }),
      )
      .subscribe();
  }

  transformNotiResToNotiItem(resItem: NotiResponseItem): NotiItem {
    const { type, id, data, createdAt, read } = resItem;

    let title = '';
    let message = '';
    let linkText = '';
    let clickLink = () => {};

    switch (type) {
      case NotificationType.accountVerified:
        if (data.status === 'success') {
          title = this.translate.transform(localized$('Account Verified'));
          message = this.translate.transform(
            localized$(
              'Your WasteTrade account is now verified. You can browse the marketplace, request info or samples, and create Listings and Wanted Listings.',
            ),
          );
          linkText = this.translate.transform(localized$('Go to Platform'));
          clickLink = () => {
            this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
            this.handleClose();
          };
        } else {
          title = this.translate.transform(localized$('Account Verification Unsuccessful'));
          message = this.translate.transform(
            localized$(
              "We couldn't verify your account at this time{{reason}}. Please review and complete the required information (e.g., company documents, permits, full address) to continue.",
            ),
            { reason: data.reason ? '. ' + data.reason : '' },
          );
          linkText = this.translate.transform(localized$('View Profile'));
          clickLink = () => {
            this.router.navigate(['/settings/profile']);
            this.handleClose();
          };
        }
        break;

      case NotificationType.accountVerifyUnsuccessful:
        title = this.translate.transform(localized$('Account Verification Unsuccessful'));
        message = this.translate.transform(
          localized$(
            "We couldn't verify your account at this time{{reason}}. Please review and complete the required information (e.g., company documents, permits, full address) to continue.",
          ),
          { reason: data.reason ? '. ' + data.reason : '' },
        );
        linkText = this.translate.transform(localized$('View Profile'));
        clickLink = () => {
          this.router.navigate(['/settings/profile']);
          this.handleClose();
        };
        break;

      case NotificationType.personalisedNotificationsEnabled:
        title = this.translate.transform(localized$('Personalised Notifications Enabled'));
        message = this.translate.transform(
          localized$(
            "You'll now receive tailored emails for Material and Wanted Listings that match your preferences. Adjust what you receive anytime.",
          ),
        );
        linkText = this.translate.transform(localized$('View Profile'));
        clickLink = () => {
          this.router.navigate(['/settings/profile']);
          this.handleClose();
        };
        break;

      case NotificationType.profileUpdated:
        title = this.translate.transform(localized$('Profile Updated'));
        message = this.translate.transform(
          localized$(
            "Your profile information was updated successfully. If this wasn't you, contact support immediately to secure your account.",
          ),
        );
        linkText = this.translate.transform(localized$('Review Profile'));
        clickLink = () => {
          this.router.navigate(['/settings/profile']);
          this.handleClose();
        };
        break;
      case NotificationType.documentExpiry:
        title = this.translate.transform(localized$('Document Expiry'));
        message = this.translate.transform(
          localized$(
            'Your document, {{documentName}}, expires on {{expiryDate}}. Please update your records to avoid disruption.',
          ),
          {
            documentName: data.documentName,
            expiryDate: moment(data.documentExpiryDate).format('DD/MM/YYYY'),
          },
        );
        linkText = this.translate.transform(localized$('Manage Documents'));
        clickLink = () => {
          this.router.navigateByUrl('/settings/documents');
          this.handleClose();
        };
        break;

      case NotificationType.newListing:
        title = this.translate.transform(localized$('New Listing Added!'));
        message = this.translate.transform(
          localized$('A new material of interest has just been added to our system: {{listingTitle}}.'),
          { listingTitle: data.listingTitle },
        );
        linkText = this.translate.transform(localized$('View Material Listing'));
        clickLink = () => {
          this.router.navigate([ROUTES_WITH_SLASH.listingOfferDetail, data.listingId]);
          this.handleClose();
        };
        break;

      case NotificationType.bidStatus:
        title = this.translate.transform(localized$('Bid Status Update'));
        message = this.translate.transform(
          localized$('Your bid on {{listingTitle}} on {{bidDate}} has been updated to {{status}}.'),
          {
            listingTitle: data.listingTitle,
            bidDate: moment(data.bidDate).format('DD/MM/YYYY'),
            status: data.status,
          },
        );
        linkText = this.translate.transform(localized$('View Material Listing'));
        clickLink = () => {
          this.router.navigate([ROUTES_WITH_SLASH.listingOfferDetail, data.listingId]);
          this.handleClose();
        };
        break;

      case NotificationType.wantedListingApproved:
        title = this.translate.transform(localized$('Listing Approved'));
        message = this.translate.transform(
          localized$('Your listing {{listingTitle}} has been approved and is now live.'),
          { listingTitle: data.listingTitle },
        );
        linkText = this.translate.transform(localized$('View Material Listing'));
        clickLink = () => {
          this.router.navigate([ROUTES_WITH_SLASH.listingOfferDetail, data.listingId]);
          this.handleClose();
        };
        break;

      case NotificationType.wantedListingRejected:
        title = this.translate.transform(localized$('Listing Rejected'));
        message = this.translate.transform(
          localized$(
            'Your listing {{listingTitle}} has been rejected by the admin{{reason}}. Please create a new listing.',
          ),
          {
            listingTitle: data.listingTitle,
            reason: data.reason ? '. ' + data.reason : '',
          },
        );
        linkText = this.translate.transform(localized$('View Marketplace'));
        clickLink = () => {
          this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
          this.handleClose();
        };
        break;

      case NotificationType.wantedListingMoreInfoRequired:
        title = this.translate.transform(localized$('Listing Requires More Information'));
        message = this.translate.transform(
          localized$(
            'Your listing {{listingTitle}} has been rejected by the admin. Please update the listing information and resubmit.',
          ),
          { listingTitle: data.listingTitle },
        );
        linkText = this.translate.transform(localized$('View Material Listing'));
        clickLink = () => {
          this.router.navigate([ROUTES_WITH_SLASH.listingOfferDetail, data.listingId]);
          this.handleClose();
        };
        break;

      default:
        title = this.translate.transform(localized$('Notification'));
        message = this.translate.transform(localized$('You have a new notification.'));
        linkText = '';
        clickLink = () => {};
        break;
    }

    const rs: NotiItem = {
      id,
      title,
      message,
      time: moment(createdAt).format('DD/MM/YYYY LT'),
      read,
      linkText,
      clickLink,
    };
    return rs;
  }

  handleViewmore() {
    if (this.viewMoreLoading()) {
      return;
    }

    this.offset.update((pre) => pre + this.perPage);

    this.notiList.nativeElement.scrollTo({
      top: this.notiList.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });

    this.handleFetchNotifications()
      ?.pipe(
        delay(300),
        tap((res) => {
          const notiData = res.data.map((item) => this.transformNotiResToNotiItem(item));
          this.notifications.update((pre) => [...(pre ?? []), ...notiData]);
        }),
        catchError(() => {
          this.snackbar.open('Unable to load more notifications. Please try again.');
          return of([]);
        }),
        finalize(() => {
          this.viewMoreLoading.set(false);
        }),
      )
      .subscribe();
  }

  handleRead() {
    if (this.maskAsReadLoading()) {
      return;
    }

    this.maskAsReadLoading.set(true);
    this.notificationService
      .maskAsRead()
      .pipe(
        tap(() => {
          this.offset.set(0);
          this.initFetchNoti();
          this.reFetchNoti.emit();
        }),
        finalize(() => {
          this.maskAsReadLoading.set(false);
        }),
        catchError(() => {
          this.snackbar.open(
            this.translate.transform(localized$('Unable to mark notification as read. Please try again.')),
          );
          return of([]);
        }),
      )
      .subscribe();
  }

  handleClose() {
    this.parentMenu.closed.emit();
  }
}
