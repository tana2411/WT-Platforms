import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';

@Component({
  selector: 'app-bid-rejected',
  imports: [MatButtonModule],
  templateUrl: './bid-rejected.component.html',
  styleUrl: './bid-rejected.component.scss',
})
export class BidRejectedComponent {
  router = inject(Router);

  onFindNew() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.buy);
  }
}
