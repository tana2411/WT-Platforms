import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetListingDetailResponse } from 'app/types/requests/admin';

@Injectable()
export class AdminListingService {
  private httpClient = inject(HttpClient);

  getDetail(listingId: string | number) {
    return this.httpClient.get<GetListingDetailResponse>(`/listings/admin/${listingId}`);
  }
}
