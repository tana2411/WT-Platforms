import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { IconComponent } from '../common/icon/icon.component';
import { LanguageSelectorComponent } from '../common/language-selector/language-selector.component';
import { NotificationComponent } from '../common/notification/notification.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-haulier-layout',
  imports: [
    HeaderComponent,
    IconComponent,
    AvatarComponent,
    NotificationComponent,
    LanguageSelectorComponent,
    FooterComponent,
    TranslateModule,
  ],
  templateUrl: './haulier-layout.component.html',
  styleUrl: './haulier-layout.component.scss',
})
export class HaulierLayoutComponent {
  @Input({ required: true }) title: string = '';
}
