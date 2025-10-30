import { NotificationType } from '../notification';

export type GetNotificationParams = {
  offset: number;
};

export type NotiResponseItem = {
  id: string;
  type: NotificationType;
  data: {
    bidDate?: string;
    status?: string;
    reason?: string;

    documentName?: string;
    documentExpiryDate?: string;

    listingId?: string;
    listingTitle?: string;
  };
  createdAt: string;
  read: boolean;
};

export type GetNotificationResponse = {
  data: NotiResponseItem[];
  total: number;
};
