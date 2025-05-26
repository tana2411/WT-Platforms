import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { materialTypes } from '@app/statics';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  imports: [MatIconModule, MatButtonModule],
})
export class MaterialComponent implements OnInit {
  @Input() materials: string[] | undefined = [];
  materialType = materialTypes;
  favoriteMaterials: string = '';
  constructor() {}

  ngOnInit() {
    if (this.materials) {
      this.favoriteMaterials = this.materials
        .map((material) => {
          const selectedType = this.materialType.find((type) => type.materials.some((item) => item.code === material));
          return selectedType ? selectedType.materials.find((item) => item.code === material)?.name : null;
        })
        .filter((name) => name !== null)
        .join(', ');
    }
  }
}
