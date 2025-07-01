import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserStatus } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-account-status-warning',
  imports: [MatIconModule, RouterModule],
  templateUrl: './account-status-warning.component.html',
  styleUrl: './account-status-warning.component.scss',
})
export class AccountStatusWarningComponent {
  authService = inject(AuthService);
  UserStatus = UserStatus;
  // status = signal<UserStatus | undefined>(undefined);
  status = toSignal(
    this.authService.user$.pipe(
      filter((user) => !!user),
      map((user) => user.status),
    ),
    {
      initialValue: undefined,
    },
  );
}
