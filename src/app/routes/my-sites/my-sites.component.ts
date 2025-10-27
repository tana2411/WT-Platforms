import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { filter, map, switchMap } from 'rxjs';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';

@Component({
  selector: 'app-my-sites',
  templateUrl: './my-sites.component.html',
  styleUrls: ['./my-sites.component.scss'],
  imports: [CommonLayoutComponent, MatIconModule, MatButtonModule, RouterModule, TranslateModule],
})
export class MySitesComponent implements OnInit {
  title: string = 'My Sites';
  titleMap = {
    'Add My Site': localized$('Add My Site'),
    'Add Location': localized$('Add Location'),
    'Edit My Site': localized$('Edit My Site'),
  };
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
        const rawTitle = data['title'] ?? 'My Sites';
        this.title =
          rawTitle in this.titleMap ? this.titleMap[rawTitle as keyof typeof this.titleMap] : localized$('My Sites');
      });
  }

  ngOnInit() {}
}
