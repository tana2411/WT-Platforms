import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonLayoutComponent } from '../../layout/common-layout/common-layout.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [CommonLayoutComponent, MatIconModule],
})
export class LandingPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
