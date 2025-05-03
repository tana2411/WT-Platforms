import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterModule],
})
export class FooterComponent implements OnInit {
  now = new Date();

  constructor() {}

  ngOnInit() {}
}
