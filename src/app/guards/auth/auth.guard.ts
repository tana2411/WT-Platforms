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
import { ROUTES } from 'app/constants/route.const';
import { User } from 'app/models/auth.model';
import { filter, first, map, pipe, tap } from 'rxjs';
import { AuthService, NOT_INITIAL_USER } from '../../services/auth.service';
import { checkAllowAccessAuthPage, getDefaultRouteByRole } from './utils';

@Injectable()
export class CanActivateAuthPage implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
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
            this.snackbar.open('You do not have access to this platform.');
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

  canActivate(): MaybeAsync<GuardResult> {
    return this.authService.user$.pipe(this.isUnAuthPipe);
  }

  canActivateChild(): MaybeAsync<GuardResult> {
    return this.authService.user$.pipe(this.isUnAuthPipe);
  }
}
