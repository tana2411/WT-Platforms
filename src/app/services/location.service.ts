import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddCompanyLocationResponse, CompanyLocationDetail, CompanyLocationResponse } from 'app/models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  private _locations$ = new BehaviorSubject<CompanyLocationDetail[] | null | undefined>([]);

  get location$() {
    return this._locations$.asObservable();
  }

  getLocations(): Observable<CompanyLocationDetail[]> {
    return this.http.get<CompanyLocationResponse>('/company-locations').pipe(
      map((res) => res.results),
      retry(3),
      tap((list) => {
        if (list.length) {
          this._locations$.next(list);
        } else {
          this._locations$.next(undefined);
        }
      }),
      catchError((err) => {
        this.snackBar.open('Failed to load company locations. Please try again.', 'OK', { duration: 3000 });
        return of([]);
      }),
    );
  }

  getLocationDetail(id: number): Observable<CompanyLocationDetail | undefined> {
    const cached = this._locations$.value;
    if (cached?.length) {
      return of(cached?.find((loc) => loc.id === id));
    }

    return this.getLocations().pipe(
      map((list) => list.find((item) => item.id === id)),
      catchError((err) => {
        this.snackBar.open('Failed to load location detail. Please try again.', 'OK', { duration: 3000 });
        return of(undefined);
      }),
    );
  }
  updateLocation(id: number, payload: any): Observable<any> {
    return this.http.put(`/company-locations/${id}`, payload);
  }

  addLocation(payload: any): Observable<any> {
    return this.http.post<AddCompanyLocationResponse>(`/company-locations/`, payload).pipe(
      map((res) => {
        if (res) {
          return res['data'];
        }
        return undefined;
      }),
    );
  }
}
