import { Component, computed, input } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { TranslateModule } from '@ngx-translate/core';
import { MemberDetail } from 'app/models/admin/commercial.model';
import { getLocationAddress } from 'app/share/utils/offer';
import { ItemOf } from 'app/types/utils';
import { cloneDeep, isNil } from 'lodash';

const MAP_CONTAINER_TYPES_TO_NAME: Record<string, string> = {
  curtain_slider_standard: 'Curtain Slider Standard',
  shipping_container: 'Container',
  walking_floor: 'Walking Floor',
  tipperTrucks: 'Tipper Trucks',
};
@Component({
  selector: 'app-admin-member-location',
  imports: [MatAccordion, MatExpansionModule, MatIconModule, TranslateModule],
  templateUrl: './admin-member-location.component.html',
  styleUrl: './admin-member-location.component.scss',
})
export class AdminMemberLocationComponent {
  locations = input<MemberDetail['company']['locations']>();
  mapCountryCodeToName = mapCountryCodeToName;

  transformedLocations = computed(() => {
    const mainLocation = this.locations()?.findIndex((location) => !!location.mainLocation);
    let newLocations = cloneDeep(this.locations() ?? []);
    if (mainLocation !== undefined && mainLocation >= 0) {
      const mainLocationItem = newLocations.splice(mainLocation, 1)[0];
      newLocations.unshift(mainLocationItem);
    }
    return newLocations;
  });

  getLocationAddress = getLocationAddress;

  private readonly materialTypes = materialTypes;

  materialAccepteds = computed(() => {
    const acceptedMaterials = (this.locations() ?? []).map((i) => i.acceptedMaterials ?? '');
    const result = acceptedMaterials.map((acceptedMaterialItem) => {
      return this.materialTypes
        .filter((type) => {
          return type.materials.some((material) => acceptedMaterialItem.includes(material.code));
        })
        .map((type) => {
          return {
            code: type.code,
            name: type.name,
            materials: type.materials.filter((material) => acceptedMaterialItem.includes(material.code)),
          };
        });
    });

    return result;
  });

  containerType(location: ItemOf<MemberDetail['company']['locations']>) {
    return location.containerType?.map((type: string) => {
      return MAP_CONTAINER_TYPES_TO_NAME[type];
    });
  }

  toYesNo(value: boolean | null | undefined): string {
    return isNil(value) ? '-' : value ? 'Yes' : 'No';
  }

  getMaterials(type: any): string {
    return type.materials.map((m: any) => m.name).join(', ');
  }
}
