import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { mapCountryCodeToName } from '@app/statics';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { ListingMemberItem } from 'app/models/admin/commercial.model';
import { MapOnboardingStatusToColor, MapOnboardingStatusToLabel, MapUserStatusToColor } from 'app/share/utils/admin';
import { isNil } from 'lodash';

@Component({
  selector: 'app-member-listing-item',
  imports: [MatButtonModule, TitleCasePipe, DatePipe, TranslateModule],
  templateUrl: './member-listing-item.component.html',
  styleUrl: './member-listing-item.component.scss',
})
export class MemberListingItemComponent {
  router = inject(Router);

  member = input<ListingMemberItem>();

  mapCountryCodeToName = mapCountryCodeToName;
  MapOnboardingStatusToLabel = MapOnboardingStatusToLabel;
  MapOnboardingStatusToColor = MapOnboardingStatusToColor;
  MapUserStatusToColor = MapUserStatusToColor as any;

  onViewDetail() {
    const userId = this.member()?.user.userId;
    if (isNil(userId)) {
      return;
    }

    this.router.navigateByUrl(`${ROUTES_WITH_SLASH.adminMemberDetail}/${userId}`);
  }
}
