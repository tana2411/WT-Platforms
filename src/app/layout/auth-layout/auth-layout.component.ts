import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  imports: [
    RouterModule,
  ]
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
