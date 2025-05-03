import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  RequestForgotPasswordParams,
  RequestLoginParams,
  ResponseLogin,
  ResponseMe,
  User,
} from '../types/requests/auth';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES } from 'app/constants/route.const';
import { ACCESS_TOKEN_KEY } from 'app/interceptors/auth.interceptor';

export const NOT_INITIAL_USER = null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null | undefined>(
    NOT_INITIAL_USER,
  );

  get isNotFinishCheckAuth() {
    return this._user$.value === NOT_INITIAL_USER;
  }

  get user$() {
    return this._user$.asObservable();
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

          // store user data in local storage for the auth interceptor
          localStorage.setItem('accessToken', loginData.accessToken);

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

  // todo: call API get me to set user
  async checkToken() {
    this.getMe()
      .pipe(
        catchError(() => {
          return of(undefined);
        }),
      )
      .subscribe((me) => {
        this._user$.next(me);
      });
  }

  getMe() {
    return this.http.get<ResponseMe>('/users/me').pipe(
      map((res) => {
        return res.data?.companyUser;
      }),
    );
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this._user$.next(undefined);
    this.router.navigateByUrl(ROUTES.login);
  }
}
