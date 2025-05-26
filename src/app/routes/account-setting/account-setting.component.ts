import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { User } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { ItemOf } from 'app/types/utils';
import { DocumentComponent } from '../account-settings/document/document.component';
import { InfoComponent } from '../account-settings/info/info.component';
import { LocationComponent } from '../account-settings/location/location.component';
import { MaterialComponent } from '../account-settings/material/material.component';
import { MyProfileComponent } from '../account-settings/my-profile/my-profile.component';
import { NotificationComponent } from '../account-settings/notification/notification.component';
import { TabContainerComponent } from '../account-settings/tab-container/tab-container.component';

const ListTab = [
  {
    icon: 'account_circle',
    title: 'my profile',
  },
  {
    icon: 'info',
    title: 'Company information',
  },
  {
    icon: 'filter_list',
    title: 'Material preferences',
  },
  {
    icon: 'notifications_active',
    title: 'Notifications',
  },
  {
    icon: 'assignment',
    title: 'Company documents',
  },
  {
    icon: 'location_on',
    title: 'My locations',
  },
] as const;

type TabKey = ItemOf<typeof ListTab>['title'];

@Component({
  selector: 'app-account-setting',
  imports: [
    CommonLayoutComponent,
    MatIconModule,
    MatTabsModule,
    TabContainerComponent,
    MyProfileComponent,
    InfoComponent,
    LocationComponent,
    NotificationComponent,
    DocumentComponent,
    MaterialComponent,
  ],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss',
})
export class AccountSettingComponent {
  activeTab = signal<number | undefined>(undefined);

  listTab = ListTab;

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

  selectTab(key: TabKey) {
    const index = ListTab.findIndex((i) => i.title === key);
    this.activeTab.set(index);
  }

  closeTab() {
    this.activeTab.set(undefined);
  }
}
