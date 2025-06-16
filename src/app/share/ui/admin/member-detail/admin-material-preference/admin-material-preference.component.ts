import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { materialTypes } from '@app/statics';

@Component({
  selector: 'app-admin-material-preference',
  imports: [],
  templateUrl: './admin-material-preference.component.html',
  styleUrl: './admin-material-preference.component.scss',
})
export class AdminMaterialPreferenceComponent {
  favoriteMaterials = input<string[] | null>();
  companyId = input<string>('');
  @Output() refresh = new EventEmitter<void>();

  private readonly materialTypes = materialTypes;

  dialog = inject(MatDialog);
  materials = computed(() => {
    const favoriteMaterials = this.favoriteMaterials() ?? [];
    return this.materialTypes
      .filter((type) => {
        return type.materials.some((material) => favoriteMaterials.includes(material.code));
      })
      .map((type) => {
        return {
          code: type.code,
          name: type.name,
          materials: type.materials.filter((material) => favoriteMaterials.includes(material.code)),
        };
      });
  });

  // openEditMaterialForm() {
  //   const dataConfig: MatDialogConfig = {
  //     data: {
  //       materials: this.materials().flatMap((type) => type.materials.map((m: any) => m.code)),
  //       companyId: this.companyId,
  //     },
  //     width: '100%',
  //     maxWidth: '960px',
  //   };
  //   const dialogRef = this.dialog.open(EditMaterialFormComponent, dataConfig);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.refresh.emit();
  //     }
  //   });
  // }

  getMaterials(type: any): string {
    return type.materials.map((m: any) => m.name).join(', ');
  }
}
