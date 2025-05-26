import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from 'app/models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  imports: [MatIconModule, MatButtonModule],
})
export class NotificationComponent {
  @Input() user: User | undefined = undefined;
}
