import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatCheckboxModule,
    MatRadioModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'watse-trade';
}
