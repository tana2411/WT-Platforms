import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { IconComponent } from '../common/icon/icon.component';
import { LanguageSelectorComponent } from '../common/language-selector/language-selector.component';
import { NotificationComponent } from '../common/notification/notification.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [
    FooterComponent,
    HeaderComponent,
    MatIconModule,
    IconComponent,
    AvatarComponent,
    NotificationComponent,
    LanguageSelectorComponent,
  ],
})
export class AdminLayoutComponent implements OnInit {
  @Input({ required: true }) title: string = '';
  constructor() {}

  ngOnInit() {}
}
