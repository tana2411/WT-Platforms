import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { BannerType } from 'app/types/requests/auth';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-account-status-warning',
  imports: [MatIcon, RouterModule],
  templateUrl: './account-status-warning.component.html',
  styleUrl: './account-status-warning.component.scss',
})
export class AccountStatusWarningComponent {
  authService = inject(AuthService);
  BannerType = BannerType;
  status = toSignal(
    this.authService.user$.pipe(
      filter((user) => !!user),
      switchMap(() => this.authService.getAccountStatus()),
      map((res) => res.data),
    ),
    {
      initialValue: undefined,
    },
  );
}
