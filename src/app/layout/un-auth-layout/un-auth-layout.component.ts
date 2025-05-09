import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-un-auth-layout',
  templateUrl: './un-auth-layout.component.html',
  styleUrls: ['./un-auth-layout.component.scss'],
  imports: [RouterModule, RouterModule, FooterComponent, MatButtonModule],
})
export class UnAuthLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
