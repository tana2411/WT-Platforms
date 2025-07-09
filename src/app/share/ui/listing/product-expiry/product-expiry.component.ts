import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ListingMaterialDetail } from 'app/models/listing-material-detail.model';
import { AuthService } from 'app/services/auth.service';
import moment from 'moment';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-expiry',
  imports: [MatIconModule, TranslateModule],
  templateUrl: './product-expiry.component.html',
  styleUrl: './product-expiry.component.scss',
})
export class ProductExpiryComponent {
  listingDetail = input<ListingMaterialDetail | undefined>();
  auth = inject(AuthService);

  userId = toSignal(this.auth.user$.pipe(map((user) => user?.userId)));
  isOwnListing = computed(() => this.userId() === this.listingDetail()?.listing.createdByUserId);

  canShow = computed(() => this.listingDetail()?.listing?.status !== 'sold');

  expiringDate = computed(() => {
    return Math.abs(moment(this.listingDetail()?.listing.endDate).diff(moment(), 'd'));
  });

  isNearingExpiry = computed(() => {
    return this.expiringDate() <= 7;
  });
}
