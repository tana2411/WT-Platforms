import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NotificationMenuComponent } from 'app/notification-menu/notification-menu.component';
@Component({
  selector: 'app-notification',
  imports: [MatIconModule, NotificationMenuComponent, MatMenu, MatMenuTrigger],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  unReadNoti = signal(10);
  amount = computed(() => (this.unReadNoti() > 9 ? `9+` : this.unReadNoti()));
}
