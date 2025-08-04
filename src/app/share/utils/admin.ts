import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { OnboardingStatus } from 'app/models/admin/commercial.model';

export const MapOnboardingStatusToLabel = {
  [OnboardingStatus.COMPANY_INFORMATION_COMPLETE]: localized$('company information complete'),
  [OnboardingStatus.COMPANY_INFORMATION_IN_PROGRESS]: localized$('company information in progress'),
  [OnboardingStatus.COMPANY_DOCUMENTS_ADDED]: localized$('company documents added'),
  [OnboardingStatus.COMPANY_DOCUMENTS_IN_PROGRESS]: localized$('company documents in progress'),
  [OnboardingStatus.SITE_LOCATION_ADDED]: localized$('site location added'),
  [OnboardingStatus.SITE_LOCATION_IN_PROGRESS]: localized$('site location in progress'),
};

export const MapUserStatusToColor = {
  'in progress': '#F9A52B',
  complete: '#03985C',
  'awaiting approval': '#D75A66',
};

export const MapOnboardingStatusToColor = {
  [OnboardingStatus.COMPANY_INFORMATION_COMPLETE]: '#03985C',
  [OnboardingStatus.COMPANY_INFORMATION_IN_PROGRESS]: '#F9A52B',
  [OnboardingStatus.COMPANY_DOCUMENTS_ADDED]: '#03985C',
  [OnboardingStatus.COMPANY_DOCUMENTS_IN_PROGRESS]: '#F9A52B',
  [OnboardingStatus.SITE_LOCATION_ADDED]: '#03985C',
  [OnboardingStatus.SITE_LOCATION_IN_PROGRESS]: '#F9A52B',
};
