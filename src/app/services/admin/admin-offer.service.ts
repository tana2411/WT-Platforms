import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferRequestActionEnum } from 'app/models/offer';
import { ListingActionParams } from 'app/types/requests/admin';
import { RequestGetOfferDetailResponse } from 'app/types/requests/offer';
import { catchError } from 'rxjs';

@Injectable()
export class AdminOfferService {
  private httpClient = inject(HttpClient);
  private snackbar = inject(MatSnackBar);

  // todo: refactor
  getDetail(id: number | string) {
    return this.httpClient.get<RequestGetOfferDetailResponse>(`/offers/${id}`).pipe(
      catchError((err) => {
        this.snackbar.open('Unable to load offer details. Please refresh the page and try again.');

        throw err;
      }),
    );
  }

  callAction(listingId: string | number, actionType: OfferRequestActionEnum, params: ListingActionParams) {
    return this.httpClient.patch(`/offers/admin/${listingId}/${actionType}`, params);
  }
}
