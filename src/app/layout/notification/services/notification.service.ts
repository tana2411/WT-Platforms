import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationType } from 'app/types/notification';
import { GetNotificationParams, GetNotificationResponse } from 'app/types/requests/notification';
import { uniqueId } from 'lodash';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  getNotifications(params: GetNotificationParams) {
    console.log(params);

    const mockRes: GetNotificationResponse = {
      data: [
        {
          id: uniqueId(),
          type: NotificationType.accountVerified,
          data: {},
          createdAt: new Date().toISOString(),
          read: false,
        },
        {
          id: uniqueId(),
          type: NotificationType.accountVerifyUnsuccessful,
          data: {},
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.profileUpdated,
          data: {},
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.documentExpiry,
          data: {
            documentName: 'Company policy',
            documentExpiryDate: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.newListing,
          data: {
            listingTitle: 'EFW',
            listingId: '289',
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.bidStatus,
          data: {
            listingTitle: 'EFW',
            listingId: '289',
            bidDate: new Date().toISOString(),
            status: 'Approved',
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.wantedListingApproved,
          data: {
            listingTitle: 'EFW',
            listingId: '289',
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.wantedListingRejected,
          data: {
            listingTitle: 'EFW',
            listingId: '289',
            reason: 'policy too long',
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: uniqueId(),
          type: NotificationType.wantedListingMoreInfoRequired,
          data: {
            listingId: '289',
            listingTitle: 'EFW',
          },
          createdAt: new Date().toISOString(),
          read: true,
        },
      ],
      total: 3,
    };

    return of(mockRes);
  }

  maskAsRead() {
    return of(true);
  }
}
