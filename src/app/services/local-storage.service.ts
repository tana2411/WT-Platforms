import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const FORGOT_PASSWORD_TIME_KEY = 'forgot-password-time';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private platformId = inject(PLATFORM_ID);
  private serverRequest = inject(REQUEST, { optional: true });

  getItem(key: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }

    return localStorage.getItem(key);
  }

  setItem(key: string, value: any) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(key, value);
  }

  getAccessToken() {
    if (isPlatformBrowser(this.platformId)) {
      return this.getItem(ACCESS_TOKEN_KEY);
    }

    const header = this.serverRequest?.headers as any;
    const cookie = header ? header.get('cookie') : '';
    const cookies = Object.fromEntries(cookie.split('; ').map((c: string) => c.split('=')));
    const accessToken = cookies['accessToken'];

    return accessToken;
  }
}
