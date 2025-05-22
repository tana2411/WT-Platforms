import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  imports: [MatButtonModule, MatIconModule, SpinnerComponent, TitleCasePipe],
})
export class MyProfileComponent {
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  user: Signal<User | undefined | null>;
  loading = computed(() => !this.user());

  constructor() {
    this.user = toSignal(this.authService.user$);

    if (!this.user) {
      this.snackBar.open('Failed to load profile details. Please try again later.', 'OK', {
        duration: 3000,
      });
    }
  }
}
