import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterParams, ListingMaterialPayload, ListingResponse, SellListingResponse } from 'app/models';
import { ListingMaterialDetailResponse, RequestInformationPayload } from 'app/models/listing-material-detail.model';
import { WantedListingResponse } from 'app/models/wanted.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  snackBar = inject(MatSnackBar);

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

  getMyListing(filter?: FilterParams): Observable<ListingResponse> {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }

    return this.httpClient.get<ListingResponse>('/listings/user', { params });
  }

  getDetail(listingId: number) {
    return this.httpClient.get<ListingMaterialDetailResponse>(`/listings/${listingId}`);
  }

  delete(listingId: number) {
    return this.httpClient.delete(`/listings/${listingId}`);
  }

  getListingsSell(filter?: any) {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }
    return this.httpClient.get<SellListingResponse>('/listings/sell', { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to load listings. Please refresh the page to try again.'));
      }),
    );
  }

  getListingsWanted(filter?: any) {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }
    return this.httpClient.get<WantedListingResponse>('/listings/wanted', { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to load listings. Please refresh the page to try again.'));
      }),
    );
  }

  requestInformation(payload: RequestInformationPayload) {
    return this.httpClient.post('/listing-requests', payload);
  }
}
