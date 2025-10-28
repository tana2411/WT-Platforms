import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-notification-item',
  imports: [MatIcon],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() time!: string;
  @Input() linkText!: string;
}
