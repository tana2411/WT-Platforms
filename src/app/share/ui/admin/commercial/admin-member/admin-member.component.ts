import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AdminCommercialService } from 'app/services/admin/admin-commercial.service';
import { PaginationComponent } from 'app/share/ui/listing/pagination/pagination.component';
import { catchError, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { MemberListingItemComponent } from '../member-listing-item/member-listing-item.component';

@Component({
  selector: 'app-admin-member',
  imports: [
    MatSnackBarModule,
    SpinnerComponent,
    PaginationComponent,
    MemberListingItemComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  providers: [TranslatePipe],
  templateUrl: './admin-member.component.html',
  styleUrl: './admin-member.component.scss',
})
export class AdminMemberComponent {
  adminCommercialService = inject(AdminCommercialService);

  page = signal(1);
  pageSize = 20;
  loading = signal(true);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  translate = inject(TranslatePipe);

  form: FormGroup = this.fb.group({
    searchTerm: [''],
  });
  updator = new Subject<void>();

  constructor() {}

  members = toSignal(
    this.updator.pipe(
      startWith(null),
      tap(() => this.loading.set(true)),
      switchMap(() => {
        const searchTerm = this.form.get('searchTerm')?.value;
        const params = !!searchTerm?.trim()
          ? {
              where: {
                or: [
                  { name: { ilike: `%${searchTerm}%` } },
                  { country: { ilike: `%${searchTerm}%` } },
                  { email: { ilike: `%${searchTerm}%` } },
                ],
              },
            }
          : {};
        return this.adminCommercialService.getMembers({
          page: this.page(),
          pageSize: this.pageSize,
          ...params,
        });
      }),
      catchError((error) => {
        this.snackBar.open(this.translate.transform(localized$('Unable to load new members data. Please try again')));
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

  search() {
    this.updator.next();
  }
}
