import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.scss'],
  imports: [MatIconModule, MatButtonModule, MatCheckboxModule],
})
export class SiteDetailComponent implements OnInit {
  location: any | undefined = undefined;
  materials: any[] = [];
  favoriteMaterials: string[] | undefined = [];

  router = inject(Router);

  constructor() {}

  ngOnInit() {}

  openEditLocation() {
    this.router.navigate([ROUTES_WITH_SLASH.sites, 'edit', 1]);
  }

  addNewLocation() {
    this.router.navigate([ROUTES_WITH_SLASH.sites, 'add']);
  }
}
