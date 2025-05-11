import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonLayoutComponent } from 'app/layout/common-layout/common-layout.component';
import { BiddingFormComponent } from 'app/share/ui/product-detail/bidding-form/bidding-form.component';
import { FilterComponent } from '../../share/ui/listing/filter/filter.component';
import { ListingFooterComponent } from '../../share/ui/listing/listing-footer/listing-footer.component';
import { PaginationComponent } from '../../share/ui/listing/pagination/pagination.component';
import { ProductGridComponent } from '../../share/ui/listing/product-grid/product-grid.component';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss'],
  imports: [
    CommonLayoutComponent,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent,
    ListingFooterComponent,
    MatDialogModule,
    BiddingFormComponent,
  ],
})
export class MarketPlaceComponent {
  constructor(private dialog: MatDialog) {}

  onPageChange(page: number) {
    console.log(page);
  }

  onFilterChange(filterParams: any) {
    console.log(filterParams);
  }

  onBid() {
    const dialogRef = this.dialog.open(BiddingFormComponent, {
      maxWidth: '960px',
      panelClass: 'px-3',
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 'buyer-seller') {
    //     // Handle buyer/seller registration
    //     this.router.navigateByUrl('/create-account');
    //   } else if (result === 'haulier') {
    //     this.router.navigateByUrl('/create-haulier-account');
    //   }
    // });
  }
}
