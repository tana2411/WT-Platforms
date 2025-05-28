import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Companies, CompaniesResponse } from 'app/models/purchases.model';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  companies$?: Observable<{ buyer: Companies[]; seller: Companies[] }>;
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  getCompanies(): Observable<{ buyer: Companies[]; seller: Companies[] }> {
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

  clearCache(): void {
    this.companies$ = undefined;
  }
}
