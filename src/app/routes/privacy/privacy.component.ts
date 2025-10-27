import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  imports: [RouterLink, UnAuthLayoutComponent],
})
export class PrivacyComponent {}
