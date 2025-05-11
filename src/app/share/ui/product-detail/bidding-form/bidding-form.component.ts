import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { catchError, finalize, from, of, tap } from 'rxjs';

@Component({
  selector: 'app-bidding-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogClose,
    IconComponent,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './bidding-form.component.html',
  styleUrl: './bidding-form.component.scss',
})
export class BiddingFormComponent {
  private validateRange = (control: AbstractControl): ValidationErrors | null => {
    const earliestDate = this.formGroup?.get('earliestDeliveryDate')?.value;
    const latestDate = control.value;

    if (earliestDate && latestDate) {
      const earliest = new Date(earliestDate);
      const latest = new Date(latestDate);

      if (latest < earliest) {
        return { invalidRange: true };
      }
    }
    return null;
  };

  formGroup = new FormGroup({
    location: new FormControl<string | null>('', [Validators.required]),
    offerValidDate: new FormControl<string | null>(null, []),
    earliestDeliveryDate: new FormControl<string | null>(null, []),
    latestDeliveryDate: new FormControl<string | null>(null, [this.validateRange]),
    loadBidOn: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    currency: new FormControl<string | null>('gbp', [Validators.required]),
    pricePerMetric: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    incoterms: new FormControl<string | null>(null, [Validators.required]),
    shippingPort: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
  });

  todayDate = new Date();
  submitting = signal(false);

  get isShowShippingPort() {
    return ['FAS', 'FOB', 'CFR', 'CIF'].includes(this.formGroup.get('incoterms')?.value ?? '');
  }

  submit() {
    if (this.submitting()) {
      return;
    }

    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      console.log(this.formGroup.controls);
      return;
    }

    this.submitting.set(true);

    from(new Promise((res, rej) => setTimeout(res, 3000)))
      .pipe(
        tap(() => {
          console.log('success');
        }),
        catchError((err) => {
          console.error(err);
          return of(undefined);
        }),
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe();
  }
}
