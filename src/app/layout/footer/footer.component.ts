import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterModule, TranslateModule],
})
export class FooterComponent implements OnInit {
  now = new Date();

  constructor() {}

  ngOnInit() {}
}
