import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { NotificationItemComponent } from 'app/notification-item/notification-item.component';
@Component({
  selector: 'app-notification-menu',
  imports: [MatMenuModule, MatButtonModule, NotificationItemComponent, CommonModule, MatIcon],
  templateUrl: './notification-menu.component.html',
  styleUrl: './notification-menu.component.scss',
})
export class NotificationMenuComponent {
  @ViewChild('menu', { static: true }) menu!: MatMenu;
  private readonly perPage = 10;

  notifications = signal([
    {
      title: 'Bid Status Update',
      message: 'Your bid on <Material Title> on <Bid Date> has been updated to <Status>.',
      linkText: 'VIEW MATERIAL LISTING',
      time: '05/11/2025, 03:44pm',
      read: false,
    },
    {
      title: 'Account Verified',
      message: 'Your WasteTrade account is now verified. You can browse and create listings.',
      linkText: 'GO TO PLATFORM',
      time: '05/11/2025, 03:44pm',
      read: false,
    },
    {
      title: 'Account Verification Unsuccessful',
      message: 'We couldn’t verify your account at this time. Please review your documents.',
      linkText: 'VIEW PROFILE',
      time: '05/11/2025, 03:44pm',
      read: true,
    },

    {
      title: 'Account Verification Unsuccessful',
      message: 'We couldn’t verify your account at this time. Please review your documents.',
      linkText: 'VIEW PROFILE',
      time: '05/11/2025, 03:44pm',
      read: true,
    },
    {
      title: 'Account Verification Unsuccessful',
      message: 'We couldn’t verify your account at this time. Please review your documents.',
      linkText: 'VIEW PROFILE',
      time: '05/11/2025, 03:44pm',
      read: true,
    },
    {
      title: 'Account Verification Unsuccessful',
      message: 'We couldn’t verify your account at this time. Please review your documents.',
      linkText: 'VIEW PROFILE',
      time: '05/11/2025, 03:44pm',
      read: true,
    },
    {
      title: 'Account Verification Unsuccessful',
      message: 'We couldn’t verify your account at this time. Please review your documents.',
      linkText: 'VIEW PROFILE',
      time: '05/11/2025, 03:44pm',
      read: true,
    },
  ]);
  total = signal<number>(20);
  offset = signal(0);
  canViewMore = computed(() => this.total() > 10);

  constructor(@Inject(MatMenu) private parentMenu: MatMenu) {}

  handleViewmore() {
    console.log('check handleViewmore function');
  }
  handleRead() {
    console.log('check handleRead function');
  }
  handleClose() {
    this.parentMenu.closed.emit();
  }
}
