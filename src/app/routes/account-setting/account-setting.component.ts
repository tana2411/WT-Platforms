import { Component, computed, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { User } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { ItemOf } from 'app/types/utils';
import { filter } from 'rxjs';
import { TabContainerComponent } from '../account-settings/tab-container/tab-container.component';

const ListTab = [
  {
    icon: 'account_circle',
    title: localized$('My profile'),
    path: 'profile',
  },
  {
    icon: 'info',
    title: localized$('Company information'),
    path: 'company-information',
  },
  {
    icon: 'filter_list',
    title: localized$('Material preferences'),
    path: 'materials',
  },
  {
    icon: 'notifications_active',
    title: localized$('Notifications'),
    path: 'notifications',
  },
  {
    icon: 'assignment',
    title: localized$('Company documents'),
    path: 'documents',
  },
] as const;

type TabKey = ItemOf<typeof ListTab>['title'];

@Component({
  selector: 'app-account-setting',
  imports: [CommonLayoutComponent, MatIconModule, MatTabsModule, RouterModule, TabContainerComponent, TranslateModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss',
})
export class AccountSettingComponent implements OnInit {
  activeTab = signal<number | undefined>(undefined);

  listTab = ListTab;

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  user: Signal<User | undefined | null>;
  loading = computed(() => !this.user());

  constructor() {
    this.user = toSignal(this.authService.user$);

    if (!this.user) {
      this.snackBar.open(localized$('Failed to load profile details. Please try again later.'), localized$('OK'), {
        duration: 3000,
      });
    }
  }

  ngOnInit() {
    this.activeTab.set(this.indexOfTab);
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.activeTab.set(this.indexOfTab);
      });
  }

  get indexOfTab(): number {
    const child = this.activatedRoute.firstChild;
    const tabName = child?.snapshot.url[0]?.path;
    const routes: string[] = Object.values(this.listTab).map((tab) => tab.path);
    if (tabName) {
      return routes.indexOf(tabName);
    }
    return 0;
  }

  selectTab(key: TabKey) {
    const index = ListTab.findIndex((i) => i.title === key);
    this.activeTab.set(index);
  }

  closeTab() {
    this.activeTab.set(undefined);
  }

  onTabChange(event: MatTabChangeEvent) {
    const segment = this.listTab[event.index];
    this.router.navigate([segment?.path], { relativeTo: this.activatedRoute });
  }
}
