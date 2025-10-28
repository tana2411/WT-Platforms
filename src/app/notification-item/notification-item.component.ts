import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  imports: [],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() time!: string;
  @Input() linkText!: string;
}
