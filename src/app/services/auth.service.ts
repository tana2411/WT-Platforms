import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../types/auth';
import { RequestLoginParams, ResponseLogin } from '../types/requests/auth';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  login({ email, password }: RequestLoginParams) {
    return this.http
      .post<ResponseLogin>(
        'https://wastetrade-api-dev.b13devops.com/auth/login',
        {
          email,
          password,
        },
      )
      .pipe(
        tap((res) => {
          console.log({ res });
          const MOCK_RES = {
            data: {
              user: {
                id: 1,
                email: 'thinguyen@b13technology.com',
                accessToken:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY3JlYXRlZEF0IjoiMjAyNS0wNC0yOFQwMjozNzoxNy44NDdaIiwiaWF0IjoxNzQ1ODA3ODM3LCJleHAiOjM0OTE2MjU2NzR9.LcFPYrz9HS7W5mv-arwO39zv_0XUW1PWTjbBkuEfvgM',
                globalRole: 'user',
              },
            },
          } as ResponseLogin;

          this.user.set(MOCK_RES.data.user as User);

          // store user data in local storage for the auth interceptor
          localStorage.setItem('accessToken', MOCK_RES.data.user.accessToken);
        }),
      );
  }

  getUser() {
    return this.user();
  }
}
