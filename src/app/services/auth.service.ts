import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FULL_PAGINATION_LIMIT } from 'app/constants/common';
import { ROUTES } from 'app/constants/route.const';
import { getDefaultRouteByRole } from 'app/guards/auth/utils';
import { ACCESS_TOKEN_KEY } from 'app/interceptors/auth.interceptor';
import { User } from 'app/models/auth.model';
import { BehaviorSubject, catchError, filter, map, of, switchMap, tap } from 'rxjs';
import {
  RequestForgotPasswordParams,
  RequestLoginParams,
  RequestSetPasswordParams,
  ResponseGetCompanyLocation,
  ResponseLogin,
  ResponseMe,
  ResquestGetCompanyLocationParams,
} from '../types/requests/auth';

export const NOT_INITIAL_USER = null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null | undefined>(NOT_INITIAL_USER);

  get isNotFinishCheckAuth() {
    return this._user$.value === NOT_INITIAL_USER;
  }

  get user$() {
    return this._user$.asObservable();
  }

  get user() {
    return this._user$.value;
  }

  get isHaulierUser(): boolean {
    return this.user?.company.isHaulier ?? false;
  }

  get isTradingUser(): boolean {
    // TODO: check this logic again
    return !this.isHaulierUser;
  }

  get companyLocations$() {
    return this.user$.pipe(
      filter((user) => !!user),
      switchMap((user) =>
        this.getCompanyLocation({ companyId: user?.companyId, limit: FULL_PAGINATION_LIMIT, page: 1 }),
      ),
    );
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login({ email, password }: RequestLoginParams) {
    return this.http
      .post<ResponseLogin>('/login', {
        email,
        password,
      })
      .pipe(
        map((res) => res.data.user),
        switchMap((loginData) => {
          if (!loginData) {
            throw new Error('Invalid login data');
          }

          this.setToken(loginData.accessToken);

          // get the user data
          return this.getMe();
        }),
        tap(async (user) => {
          this._user$.next(user);
        }),
      );
  }

  forgotPassword(params: RequestForgotPasswordParams) {
    return this.http.post('/forgot-password', params);
  }

  setPassword(params: RequestSetPasswordParams) {
    return this.http.post('/reset-password', params);
  }

  setToken(token: string) {
    // store user data in local storage for the auth interceptor
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  // todo: call API get me to set user
  checkToken() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    let source = of<User | undefined>(undefined);

    if (accessToken) {
      source = this.getMe().pipe(
        catchError(() => {
          return of(undefined);
        }),
      );
    }

    return source.pipe(
      tap((me) => {
        this._user$.next(me);
      }),
    );
  }

  getDefaultRouteByRole() {
    const user = this._user$.value;

    if (!user) {
      return ROUTES.login;
    }

    return getDefaultRouteByRole(user);
  }

  getMe() {
    return this.http.get<ResponseMe>('/users/me').pipe(
      map((res) => {
        const user = res.data?.companyUser;
        if (user.company) {
          user.company.companyDocuments = res.data.companyDocuments;
        }

        return user;
      }),
    );
  }

  getCompanyLocation({ companyId, page, limit }: ResquestGetCompanyLocationParams) {
    const safeLimit = limit ?? 10;
    const skip = (page - 1) * safeLimit;

    const encodedFilter = JSON.stringify({
      skip,
      limit: safeLimit,
      where: {
        companyId,
      },
    });

    let params = new HttpParams({
      fromObject: {
        filter: encodedFilter,
      },
    });

    params.set('filter', encodedFilter);

    return this.http.get<ResponseGetCompanyLocation>('/company-locations', {
      params,
    });
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this._user$.next(undefined);
    this.router.navigateByUrl(ROUTES.login);
  }
}
