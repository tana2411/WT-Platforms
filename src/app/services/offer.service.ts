import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  RequestGetOfferDetailResponse,
  RequestGetOffersParams,
  RequestGetOffersResponse,
} from 'app/types/requests/offer';
import { catchError } from 'rxjs';

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

  getOffers({ listingId, page, isSeller }: RequestGetOffersParams) {
    const params = new HttpParams({
      fromObject: {
        filter: JSON.stringify({
          limit: 10,
          skip: (page - 1) * 10,
          where: {
            isSeller,
            listingId,
          },
        }),
      },
    });

    return this.http
      .get<RequestGetOffersResponse>('/offers', {
        params,
      })
      .pipe(
        catchError((err) => {
          this.snackbar.open('Unable to load offer details. Please refresh the page and try again.');

          throw err;
        }),
      );
  }

  getOfferListing({ listingId, page, isSeller }: Required<RequestGetOffersParams>) {
    return this.getOffers({ listingId, page, isSeller });
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
}
