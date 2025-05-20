import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterParams, ListingMaterialPayload, ListingResponse } from 'app/models';
import { ListingMaterialDetailResponse } from 'app/models/listing-material-detail.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  constructor(private httpClient: HttpClient) {}

  createListing(payload: Partial<ListingMaterialPayload>) {
    return this.httpClient.post('/listings', payload);
  }

  get(filter?: FilterParams): Observable<ListingResponse> {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }

    return this.httpClient.get<ListingResponse>('/listings', { params });
  }

  getDetail(listingId: number) {
    return this.httpClient.get<ListingMaterialDetailResponse>(`/listings/${listingId}`);
  }

  delete(listingId: number) {
    return this.httpClient.delete(`/listings/${listingId}`);
  }
}
