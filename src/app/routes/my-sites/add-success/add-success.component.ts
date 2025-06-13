import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-success',
  templateUrl: './add-success.component.html',
  styleUrls: ['./add-success.component.scss'],
  imports: [MatIconModule, MatButtonModule, RouterModule],
})
export class AddSuccessComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
