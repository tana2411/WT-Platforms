import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { materialTypes } from '@app/statics';
import { AuthService } from 'app/services/auth.service';
import { EditMaterialFormComponent } from './edit-material-form/edit-material-form.component';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatCheckboxModule],
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() favoriteMaterials: string[] | undefined = [];
  @Input() companyId: number | undefined;
  materialType = materialTypes;
  materials: any[] = [];

  dialog = inject(MatDialog);
  authService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    if (this.favoriteMaterials) {
      this.showMaterial();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['favoriteMaterials'] && changes['favoriteMaterials'].currentValue) {
      this.showMaterial();
    }
  }

  showMaterial() {
    this.materials = this.materialType
      .filter((type) => {
        return type.materials.some((material) => this.favoriteMaterials?.includes(material.code));
      })
      .map((type) => {
        return {
          code: type.code,
          name: type.name,
          materials: type.materials.filter((material) => this.favoriteMaterials?.includes(material.code)),
        };
      });
  }

  openEditMaterialForm() {
    const dataConfig: MatDialogConfig = {
      data: {
        materials: this.materials.flatMap((type) => type.materials.map((m: any) => m.code)),
        companyId: this.companyId,
      },
      width: '100%',
      maxWidth: '960px',
    };
    const dialogRef = this.dialog.open(EditMaterialFormComponent, dataConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.checkToken().subscribe();
      }
    });
  }
}
