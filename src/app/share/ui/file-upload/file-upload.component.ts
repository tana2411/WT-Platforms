import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [MatButtonModule]
})
export class FileUploadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
