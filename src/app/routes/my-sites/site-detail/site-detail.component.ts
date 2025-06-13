import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { mapCountryCodeToName, materialTypes } from '@app/statics';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { CompanyLocationDetail, ContainerTypeList } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { LocationService } from 'app/services/location.service';
import { SpinnerComponent } from 'app/share/ui/spinner/spinner.component';
import { finalize, retry } from 'rxjs';
import { DocumentComponent } from '../../account-settings/document/document.component';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatCheckboxModule, DocumentComponent, SpinnerComponent, TitleCasePipe],
})
export class SiteDetailComponent implements OnInit {
  loading = signal(false);
  locations: Signal<CompanyLocationDetail[] | undefined | null>;

  materialTypes = materialTypes;
  containerList = ContainerTypeList;
  materials: string = '';
  containerManage: string = '';
  mapCountryCodeToName = mapCountryCodeToName;
  location: CompanyLocationDetail | undefined = undefined;
  router = inject(Router);
  route = inject(ActivatedRoute);
  locationService = inject(LocationService);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.locations = toSignal(this.locationService.location$);
    effect(() => {
      this.refresh();
    });
  }

  ngOnInit() {}

  openEditLocation() {
    this.router.navigate([ROUTES_WITH_SLASH.sites, 'edit', this.location?.id]);
  }

  addNewLocation() {
    this.router.navigate([ROUTES_WITH_SLASH.sites, 'add']);
  }

  refresh() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params['id']);
      const cached = this.locations();

      if (Array.isArray(cached) && cached.length > 0) {
        const found = cached.find((l) => l.id === id);
        if (found) {
          this.loading.set(true);
          this.setLocationDetail(found);
          this.loading.set(false);
          return;
        }
      }

      this.loading.set(true);
      this.locationService
        .getLocationDetail(id)
        .pipe(
          retry(3),
          finalize(() => this.loading.set(false)),
        )
        .subscribe((loc) => {
          if (loc) {
            this.setLocationDetail(loc);
          }
        });
    });
  }

  countryCodeToName(code: string | undefined): string {
    if (!code) {
      return '';
    }
    return this.mapCountryCodeToName[code];
  }

  private setLocationDetail(loc: CompanyLocationDetail) {
    this.location = loc;

    this.containerManage = this.containerList
      .filter((c) => loc.containerType.includes(c.value))
      .map((c) => c.name)
      .join(', ');

    const materialWithoutType = materialTypes.flatMap((t) => t.materials);

    this.materials =
      loc.acceptedMaterials
        ?.map((code) => {
          const found = materialWithoutType.find((m) => m.code === code);
          return found ? found.name : code;
        })
        .join(', ') ?? '';
  }
}
