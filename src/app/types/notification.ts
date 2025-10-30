export type NotiItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkText?: string;
  clickLink?: () => void;
};

export enum NotificationType {
  accountVerified = 'accountVerified',
  accountVerifyUnsuccessful = 'accountVerifyUnsuccessful',
  profileUpdated = 'profileUpdated',
  personalisedNotificationsEnabled = 'personalisedNotificationsEnabled',
  documentExpiry = 'documentExpiry',
  newListing = 'newListing',
  bidStatus = 'bidStatus',
  wantedListingApproved = 'wantedListingApproved',
  wantedListingRejected = 'wantedListingRejected',
  wantedListingMoreInfoRequired = 'wantedListingMoreInfoRequired',
}
