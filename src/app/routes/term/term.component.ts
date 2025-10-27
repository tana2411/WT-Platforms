import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnAuthLayoutComponent } from 'app/layout/un-auth-layout/un-auth-layout.component';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss'],
  imports: [RouterLink, UnAuthLayoutComponent],
})
export class TermComponent {}
