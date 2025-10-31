import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-material-item',
  imports: [CommonModule],
  templateUrl: './material-item.component.html',
  styleUrl: './material-item.component.scss',
})
export class MaterialItemComponent {
  @Input() offer: any;
}
