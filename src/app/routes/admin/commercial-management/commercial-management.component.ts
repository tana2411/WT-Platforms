import { Location } from '@angular/common';
import { Component, DestroyRef, inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES_WITH_SLASH } from 'app/constants/route.const';
import { ListingState } from 'app/models';
import { OfferState } from 'app/models/offer';
import { AdminCommercialService } from 'app/services/admin/admin-commercial.service';
import { ListingService } from 'app/services/listing.service';
import { OfferService } from 'app/services/offer.service';
import { combineLatest, filter, forkJoin, startWith, switchMap, tap, timer } from 'rxjs';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';

enum TabPath {
  members = 'members',
  sellers = 'sellers',
  buyers = 'buyers',
  wanted = 'wanted',
}

@Component({
  selector: 'app-commercial-management',
  templateUrl: './commercial-management.component.html',
  styleUrls: ['./commercial-management.component.scss'],
  imports: [AdminLayoutComponent, MatTabsModule, MatIconModule, RouterModule, TranslateModule],
  providers: [AdminCommercialService, OfferService],
})
export class CommercialManagementComponent {
  router = inject(Router);
  activeTab = signal(0);
  selectedIndex = 0;
  destroyRef = inject(DestroyRef);

  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  listingsService = inject(ListingService);
  offerService = inject(OfferService);
  adminCommercialService = inject(AdminCommercialService);
  injector = inject(Injector);

  initTab = Number(this.activeRoute.snapshot.queryParams['tab'] ?? 0);
  // needCheck = signal<any>({
  //   sellers: false,
  //   buyers: false,
  //   wanted: false,
  // });

  listTabs = [
    { label: localized$('USERS'), path: TabPath.members },
    { label: localized$('LISTINGS'), path: TabPath.sellers },
    { label: localized$('OFFERS'), path: TabPath.buyers },
    { label: localized$('WANTED LISTINGS'), path: TabPath.wanted },
  ];

  pendingCount = signal<Record<TabPath, number | undefined>>({
    [TabPath.members]: undefined,
    [TabPath.buyers]: undefined,
    [TabPath.sellers]: undefined,
    [TabPath.wanted]: undefined,
  });

  ngOnInit() {
    const navigation$ = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd));

    runInInjectionContext(this.injector, () => {
      combineLatest([navigation$.pipe(startWith(null)), timer(0, 10000)])
        .pipe(
          tap(() => {
            this.selectedIndex = this.indexOfTab;
          }),
          switchMap(() => {
            return this.checkPendingState();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  get indexOfTab(): number {
    const routes = Object.values(this.listTabs).map((tab) => tab.path);

    const child = this.activatedRoute.firstChild;
    const tabName = child?.snapshot.url[0]?.path as TabPath;

    if (tabName) {
      return routes.indexOf(tabName);
    }
    return 0;
  }

  onBack() {
    this.router.navigateByUrl(ROUTES_WITH_SLASH.commercialManagement);
  }

  onTabChange(event: MatTabChangeEvent) {
    const segment = this.listTabs[event.index].path;
    this.router.navigate([segment], { relativeTo: this.activatedRoute });
  }

  checkPendingState() {
    const checkWanted = this.listingsService.getListingsWanted({
      where: {
        state: ListingState.PENDING,
      },
    });

    // const checkMember = this.adminCommercialService.getMembers({
    //   page: 0,
    //   pageSize: 10,
    //   where: {
    //     or: [{ name: { ilike: '%keyword%' } }, { country: { ilike: '%keyword%' } }, { email: { ilike: '%keyword%' } }],
    //   },
    // });

    const checkOffers = this.offerService.getPurchases({
      where: {
        state: OfferState.PENDING,
      },
    });

    const checkListing = this.listingsService.getListingsSell({
      where: {
        state: ListingState.PENDING,
      },
    });

    return forkJoin([
      // checkMember,
      checkListing,
      checkOffers,
      checkWanted,
    ]).pipe(
      tap(([listings, offers, wanted]) => {
        this.pendingCount.set({
          [TabPath.members]: undefined,
          [TabPath.sellers]: Number(listings.totalCount),
          [TabPath.buyers]: Number(offers.totalCount),
          [TabPath.wanted]: Number(wanted.totalCount),
        });
      }),
    );
  }
}
