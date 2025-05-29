import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SellerCompaniesResponse } from 'app/models';
import { Companies, CompaniesResponse } from 'app/models/purchases.model';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  companies$?: Observable<{ buyer: Companies[]; seller: Companies[] }>;
  sellerCompanies$?: Observable<Companies[]>;
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  getOfferCompanies(): Observable<{ buyer: Companies[]; seller: Companies[] }> {
    if (!this.companies$) {
      this.companies$ = this.http.get<CompaniesResponse>('/offers/admin/companies').pipe(
        map((res) => ({
          buyer: res.data.buyerCompanies,
          seller: res.data.sellerCompanies,
        })),
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError((err) => {
          this.companies$ = undefined;
          this.snackBar.open('Failed to load companies. Please try again.', 'OK', {
            duration: 3000,
          });
          return of({ buyer: [], seller: [] });
        }),
      );
    }
    return this.companies$;
  }

  getCompanies(filter: string): Observable<Companies[]> {
    if (!this.sellerCompanies$) {
      this.sellerCompanies$ = this.http
        .get<SellerCompaniesResponse>(`/listings/admin/companies?listingType=${filter}`)
        .pipe(
          map((res) => {
            return res.data.companies;
          }),
          shareReplay({ bufferSize: 1, refCount: true }),
          catchError((err) => {
            this.sellerCompanies$ = undefined;
            this.snackBar.open('Failed to load companies. Please try again.', 'OK', {
              duration: 3000,
            });
            return of([]);
          }),
        );
    }
    return this.sellerCompanies$;
  }

  clearCache(): void {
    this.companies$ = undefined;
    this.sellerCompanies$ = undefined;
  }
}
