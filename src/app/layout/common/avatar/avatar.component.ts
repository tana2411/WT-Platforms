import { Component, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from 'app/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { map, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { MatIconModule } from '@angular/material/icon';
import { ROUTES, ROUTES_WITH_SLASH } from 'app/constants/route.const';

@Component({
  selector: 'app-avatar',
  imports: [MatMenuModule, RouterModule, IconComponent, MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  compactUserName: Signal<string>;
  userName: Signal<string>;

  routes = ROUTES_WITH_SLASH

  constructor(private authService: AuthService) {
    this.compactUserName = toSignal(
      this.authService.user$.pipe(
        map((user) =>
          user ? `${user.user.firstName[0]} ${user.user.lastName[0]}` : '',
        ),
      ),
      {
        initialValue: '',
      },
    );

    this.userName = toSignal(
      this.authService.user$.pipe(
        map((user) =>
          user ? `${user.user.firstName} ${user.user.lastName}` : '',
        ),
      ),
      {
        initialValue: '',
      },
    );
  }
}
