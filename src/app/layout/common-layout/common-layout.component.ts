import { Component, Input } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../common/icon/icon.component';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { NotificationComponent } from '../common/notification/notification.component';
import { LanguageSelectorComponent } from '../common/language-selector/language-selector.component';

@Component({
  selector: 'app-common-layout',
  imports: [
    FooterComponent,
    HeaderComponent,
    MatIconModule,
    IconComponent,
    AvatarComponent,
    NotificationComponent,
    LanguageSelectorComponent,
  ],
  templateUrl: './common-layout.component.html',
  styleUrl: './common-layout.component.scss',
})
export class CommonLayoutComponent {
  @Input({ required: true }) title: string = '';
}
