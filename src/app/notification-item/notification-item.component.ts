import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IconComponent } from 'app/layout/common/icon/icon.component';

type NotiItem = {
  title: string;
  message: string;
  time: string;
  read: boolean;
  linkText?: string;
  clickLink?: () => void;
};

@Component({
  selector: 'app-notification-item',
  imports: [MatIcon, IconComponent],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
  noti = input<NotiItem | undefined>();
}
