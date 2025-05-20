import { Component, EnvironmentInjector, inject, runInInjectionContext, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { AuthService } from 'app/services/auth.service';
import { ConfirmModalComponent, ConfirmModalProps } from 'app/share/ui/confirm-modal/confirm-modal.component';
import { map } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-avatar',
  imports: [MatMenuModule, RouterModule, IconComponent, MatIconModule, MatDialogModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  compactUserName: Signal<string>;
  userName: Signal<string>;

  routes = ROUTES_WITH_SLASH;
  dialog = inject(MatDialog);
  router = inject(Router);
  private injector = inject(EnvironmentInjector);

  constructor(private authService: AuthService) {
    this.compactUserName = toSignal(
      this.authService.user$.pipe(map((user) => (user ? `${user.user.firstName[0]} ${user.user.lastName[0]}` : ''))),
      {
        initialValue: '',
      },
    );

    this.userName = toSignal(
      this.authService.user$.pipe(map((user) => (user ? `${user.user.firstName} ${user.user.lastName}` : ''))),
      {
        initialValue: '',
      },
    );
  }

  onLogout() {
    runInInjectionContext(this.injector, () => {
      this.dialog
        .open<ConfirmModalComponent, ConfirmModalProps>(ConfirmModalComponent, {
          maxWidth: '500px',
          width: '100%',
          panelClass: 'px-3',
          data: {
            title: 'Are you sure you want to log out?',
          },
        })
        .afterClosed()
        .pipe(takeUntilDestroyed())
        .subscribe((shouldLogout) => {
          debugger;
          if (shouldLogout) {
            this.router.navigateByUrl(ROUTES_WITH_SLASH.logout);
          }
        });
    });
  }
}
