import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminCommercialService } from 'app/services/admin/admin-commercial.service';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { catchError, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { MemberListingItemComponent } from '../member-listing-item/member-listing-item.component';

@Component({
  selector: 'app-admin-member',
  imports: [MatSnackBarModule, SpinnerComponent, PaginationComponent, MemberListingItemComponent],
  templateUrl: './admin-member.component.html',
  styleUrl: './admin-member.component.scss',
})
export class AdminMemberComponent {
  adminCommercialService = inject(AdminCommercialService);

  page = signal(1);
  pageSize = 20;
  loading = signal(true);
  snackBar = inject(MatSnackBar);

  updator = new Subject<void>();

  members = toSignal(
    this.updator.pipe(
      startWith(null), // Trigger initial load
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.adminCommercialService.getMembers({
          page: this.page(),
          pageSize: this.pageSize,
        }),
      ),
      catchError((error) => {
        this.snackBar.open('Unable to load new members data. Please try again');
        console.error('Error fetching members:', error);
        return of({
          data: [],
          total: 0,
        });
      }),
      tap(() => this.loading.set(false)),
    ),
  );

  onPageChange(p: number) {
    this.page.set(p);
    this.updator.next();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
