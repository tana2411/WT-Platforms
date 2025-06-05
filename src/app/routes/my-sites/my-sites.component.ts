import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';

@Component({
  selector: 'app-my-sites',
  templateUrl: './my-sites.component.html',
  styleUrls: ['./my-sites.component.scss'],
  imports: [CommonLayoutComponent, MatIconModule, MatButtonModule, RouterModule],
})
export class MySitesComponent implements OnInit {
  title: string = 'My Sites';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let currentRoute: ActivatedRoute = this.route;
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }
          return currentRoute;
        }),
        switchMap((child: ActivatedRoute) => child.data),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data: Data) => {
        this.title = data['title'] ?? 'My Sites';
      });
  }

  ngOnInit() {}
}
