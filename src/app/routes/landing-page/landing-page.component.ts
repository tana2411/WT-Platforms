import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [CommonLayoutComponent, MatIconModule, TranslateModule],
})
export class LandingPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
