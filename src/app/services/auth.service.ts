import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../types/auth';
import {
  RequestForgotPasswordParams,
  RequestLoginParams,
  ResponseLogin,
} from '../types/requests/auth';
import { BehaviorSubject, tap } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  login({ email, password }: RequestLoginParams) {
    return this.http
      .post<ResponseLogin>('https://wastetrade-api-dev.b13devops.com/login', {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this._user$.next(res.data.user as User);

          // store user data in local storage for the auth interceptor
          localStorage.setItem('accessToken', res.data.user.accessToken);
        }),
      );
  }

  forgotPassword(params: RequestForgotPasswordParams) {
    return this.http.post(
      'https://wastetrade-api-dev.b13devops.com/auth/forgot-password',
      params,
    );
  }

  // todo: call API get me to set user
  async checkToken() {
    const mockUser = await new Promise<User | undefined>((res, reject) => {
      console.log({ res });
      const MOCK_RES = {
        data: {
          user: {
            id: 1,
            email: 'thinguyen@b13technology.com',
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY3JlYXRlZEF0IjoiMjAyNS0wNC0yOFQwMjozNzoxNy44NDdaIiwiaWF0IjoxNzQ1ODA3ODM3LCJleHAiOjM0OTE2MjU2NzR9.LcFPYrz9HS7W5mv-arwO39zv_0XUW1PWTjbBkuEfvgM',
            globalRole: 'user',
            isHaulier: false,
          },
        },
      } as ResponseLogin;

      res(MOCK_RES.data.user as User);
      // res(undefined);
    });

    this._user$.next(mockUser);
    localStorage.setItem('accessToken', mockUser?.accessToken ?? '');
  }
}
