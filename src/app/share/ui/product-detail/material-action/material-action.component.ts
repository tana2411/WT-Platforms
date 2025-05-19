import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BiddingFormComponent } from '../bidding-form/bidding-form.component';

@Component({
  selector: 'app-material-action',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './material-action.component.html',
  styleUrl: './material-action.component.scss',
})
export class MaterialActionComponent {
  @Input({ required: true }) isSeller: boolean = false;

  dialog = inject(MatDialog);

  onBid() {
    const dialogRef = this.dialog.open(BiddingFormComponent, {
      maxWidth: '750px',
      width: '100%',
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
