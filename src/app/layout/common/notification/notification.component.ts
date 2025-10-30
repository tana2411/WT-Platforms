import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NotificationMenuComponent } from 'app/layout/notification/notification-menu/notification-menu.component';
import { tap, timer } from 'rxjs';
@Component({
  selector: 'app-notification',
  imports: [MatIconModule, NotificationMenuComponent, MatMenu, MatMenuTrigger],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  unReadNoti = signal(0);
  amount = computed(() => (this.unReadNoti() > 9 ? `9+` : this.unReadNoti()));

  constructor() {
    this.fetchUnReadNoti();
  }

  fetchUnReadNoti() {
    timer(0, 10000)
      .pipe(
        // todo: call API to get unread noti
        tap(() => {
          this.unReadNoti.set(10);
        }),
      )
      .subscribe();
  }

  onReFetchNoti() {
    this.unReadNoti.set(0);
  }
}
