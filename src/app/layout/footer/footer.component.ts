import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, NOT_INITIAL_USER } from 'app/services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterModule, TranslateModule],
})
export class FooterComponent {
  now = new Date();

  authService = inject(AuthService);

  isAuth = toSignal(
    this.authService.user$.pipe(
      filter((user) => user !== NOT_INITIAL_USER),
      map((user) => !!user),
    ),
  );
}
