import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from 'app/services/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-account-status-warning',
  imports: [],
  templateUrl: './account-status-warning.component.html',
  styleUrl: './account-status-warning.component.scss',
})
export class AccountStatusWarningComponent {
  authService = inject(AuthService);
  status = signal(undefined);

  constructor() {
    this.authService.user$
      .pipe(
        tap((user) => {
          this.status.set(user?.status);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
