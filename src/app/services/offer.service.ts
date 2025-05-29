import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseFilterParams, PurchaseResponse } from 'app/models/purchases.model';
import {
  RequestCreateBidParams,
  RequestGetBuyingOffersResponse,
  RequestGetOfferDetailResponse,
  RequestGetOffersParams,
  RequestGetSellingOffersResponse,
} from 'app/types/requests/offer';
import { catchError, throwError } from 'rxjs';

// Since its a stateless service, I make it provided in root
@Injectable()
export class OfferService {
  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {}

  getOfferDetail(id: number) {
    return this.http.get<RequestGetOfferDetailResponse>(`/offers/${id}`).pipe(
      catchError((err) => {
        this.snackbar.open('Unable to load offer details. Please refresh the page and try again.');

        throw err;
      }),
    );
  }

  getSellingOffers({ listingId, page }: Omit<RequestGetOffersParams, 'isSeller'>) {
    const params = new HttpParams({
      fromObject: {
        filter: JSON.stringify({
          limit: 10,
          skip: (page - 1) * 10,
          where: {
            isSeller: true,
            listingId,
          },
        }),
      },
    });

    return this.http
      .get<RequestGetSellingOffersResponse>('/offers', {
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Unable to load offer details. Please refresh the page and try again.');

          throw err;
        }),
      );
  }

  getBuyingOffers({ listingId, page }: Omit<RequestGetOffersParams, 'isSeller'>) {
    const params = new HttpParams({
      fromObject: {
        filter: JSON.stringify({
          limit: 10,
          skip: (page - 1) * 10,
          where: {
            isSeller: false,
            listingId,
          },
        }),
      },
    });

    return this.http
      .get<RequestGetBuyingOffersResponse>('/offers', {
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Unable to load offer details. Please refresh the page and try again.');

          throw err;
        }),
      );
  }

  // getOfferListing({ listingId, page, isSeller }: Required<RequestGetOffersParams>) {
  //   return this.getSellingOffers({ listingId, page, isSeller });
  // }

  createBid(params: RequestCreateBidParams) {
    return this.http.post(`/offers`, params).pipe(
      catchError((err) => {
        this.snackbar.open('Failed to accept the bid. Please check your network connection and try again.');

        throw err;
      }),
    );
  }

  acceptBid(id: number) {
    return this.http.patch(`/offers/${id}/accept`, undefined).pipe(
      catchError((err) => {
        this.snackbar.open('Failed to accept the bid. Please check your network connection and try again.');

        throw err;
      }),
    );
  }

  rejectBid(id: number, reason: string) {
    return this.http
      .patch(`/offers/${id}/reject`, {
        rejectionReason: reason,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Failed to reject the bid. Please try again later.');

          throw err;
        }),
      );
  }

  getPurchases(filter?: PurchaseFilterParams) {
    let params = new HttpParams();

    if (filter) {
      const encodedFilter = JSON.stringify(filter);
      params = params.set('filter', encodedFilter);
    }
    return this.http.get<PurchaseResponse>('/offers/admin', { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to load purchase data. Please try refreshing the page.'));
      }),
    );
  }
}
