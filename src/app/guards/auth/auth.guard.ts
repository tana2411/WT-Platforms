import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ROUTES } from 'app/constants/route.const';
import { User } from 'app/models/auth.model';
import { filter, first, map, of, pipe, tap } from 'rxjs';
import { AuthService, NOT_INITIAL_USER } from '../../services/auth.service';
import { checkAllowAccessAuthPage, getDefaultRouteByRole } from './utils';

@Injectable()
export class CanActivateAuthPage implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const requireAuthParams = route.data['requireAuthParams'];

    return this.authService.user$.pipe(
      filter((i) => i !== NOT_INITIAL_USER),
      first(),
      tap((user) => {
        if (!user) {
          this.router.navigateByUrl(ROUTES.login);
        }

        if (user && requireAuthParams) {
          const isValid = checkAllowAccessAuthPage(user, requireAuthParams);
          if (!isValid) {
            this.snackbar.open(this.translate.instant(localized$('You do not have access to this platform.')));
            // invalid allowed access => redirect to login
            this.router.navigateByUrl(ROUTES.login);
          }
        }
      }),
      map((user) => !!user),
    );
  }
}

@Injectable()
export class CanActivateUnAuthPage implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  isUnAuthPipe = pipe(
    filter((i) => i !== NOT_INITIAL_USER),
    first(),
    tap((user) => {
      if (user) {
        const targetRoute = getDefaultRouteByRole(user as User);
        this.router.navigateByUrl(targetRoute);
      }
    }),
    map((user) => !user),
  );

  canActivate(route: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
    const queryParams = route.queryParams;
    const allowAuth = queryParams['lost_pass'] || queryParams['reset_pass'];

    if (allowAuth) {
      return of(true);
    }

    return this.authService.user$.pipe(this.isUnAuthPipe);
  }

  canActivateChild(route: ActivatedRouteSnapshot): MaybeAsync<GuardResult> {
    const queryParams = route.queryParams;
    const allowAuth = queryParams['lost_pass'] || queryParams['reset_pass'];

    if (allowAuth) {
      return of(true);
    }

    return this.authService.user$.pipe(this.isUnAuthPipe);
  }
}
