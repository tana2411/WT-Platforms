import { Component, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'app/services/auth.service';
import { map, Observable, tap } from 'rxjs';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { HeaderService } from 'app/services/header.service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, AvatarComponent, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public headerService: HeaderService) {}
}
