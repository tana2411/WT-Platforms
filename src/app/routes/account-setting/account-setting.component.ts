import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { ItemOf } from 'app/types/utils';
import { TabContainerComponent } from '../account-settings/tab-container/tab-container.component';
import { MyProfileComponent } from '../account-settings/my-profile/my-profile.component';
import { FilterComponent } from '../account-settings/filter/filter.component';
import { NotificationComponent } from '../account-settings/notification/notification.component';
import { DocumentComponent } from '../account-settings/document/document.component';
import { InfoComponent } from '../account-settings/info/info.component';

const ListTab = [
  {
    icon: 'account_circle',
    title: 'my profile',
  },
  {
    icon: 'info',
    title: 'company info',
  },
  {
    icon: 'filter_list',
    title: 'Search Filters',
  },
  {
    icon: 'notifications_active',
    title: 'notifications',
  },
  {
    icon: 'assignment',
    title: 'company documents',
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
    FilterComponent,
    NotificationComponent,
    DocumentComponent,
  ],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss',
})
export class AccountSettingComponent {
  activeTab = signal<number | undefined>(undefined);

  listTab = ListTab;

  selectTab(key: TabKey) {
    const index = ListTab.findIndex((i) => i.title === key);
    this.activeTab.set(index);
  }

  closeTab() {
    this.activeTab.set(undefined);
  }
}
