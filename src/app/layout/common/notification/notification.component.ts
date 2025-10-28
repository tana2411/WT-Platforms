import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationMenuComponent } from 'app/notification-menu/notification-menu.component';
import { BehaviorSubject, map } from 'rxjs';
@Component({
  selector: 'app-notification',
  imports: [MatIconModule, MatMenuModule, NotificationMenuComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  private amount$ = new BehaviorSubject(10);

  amount = toSignal(
    this.amount$.pipe(
      map((value) => {
        if (value <= 9) {
          return `${value}`;
        }
        return '9+';
      }),
    ),
  );
}
