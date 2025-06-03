import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IconComponent } from 'app/layout/common/icon/icon.component';
import { SettingsService } from 'app/services/settings.service';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-edit-social-url-form',
  templateUrl: './edit-social-url-form.component.html',
  styleUrls: ['./edit-social-url-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    IconComponent,
    MatButtonModule,
    MatSnackBarModule,
    MatOptionModule,
    MatDialogModule,
    MatIconModule,
  ],
})
export class EditSocialUrlFormComponent implements OnInit {
  formGroup = new FormGroup({
    urls: new FormArray([]),
    newUrl: new FormGroup({
      name: new FormControl<string | null>(null, []),
      url: new FormControl<string | null>(null, [
        Validators.pattern(
          /^(?:https?:\/\/)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,6}(?:\/[A-Za-z0-9\-._~:\/?#[\]@!$&'()*+,;=%]*)?$/,
        ),
      ]),
    }),
  });

  readonly dialogRef = inject(MatDialogRef<{ [key: string]: string }>);
  readonly data = inject<{ urlInfo: { [key: string]: string }; companyId: number }>(MAT_DIALOG_DATA);
  snackBar = inject(MatSnackBar);
  settingsService = inject(SettingsService);
  submitting = signal(false);

  get urls() {
    return this.formGroup.get('urls') as FormArray;
  }

  get newUrl() {
    return this.formGroup.controls.newUrl as FormGroup;
  }

  constructor() {}

  ngOnInit() {
    if (this.data.urlInfo) {
      const { urlInfo } = this.data;
      Object.keys(urlInfo).map((key) => {
        const urlGroup = new FormGroup({
          key: new FormControl(key),
          value: new FormControl(urlInfo[key], [
            Validators.pattern(
              /^(?:https?:\/\/)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,6}(?:\/[A-Za-z0-9\-._~:\/?#[\]@!$&'()*+,;=%]*)?$/,
            ),
          ]),
        });

        this.urls.push(urlGroup);
      });
      this.formGroup.updateValueAndValidity();
    }
  }

  extractWebsiteName(key: string): string {
    const tokens = key.match(/[A-Z]?[a-z]+|[A-Z]/g);
    if (!tokens) {
      return '';
    }

    if (tokens[tokens.length - 1].toLowerCase() === 'url') {
      tokens.pop();
    }
    const labelPart = tokens.map((tok) => tok.toUpperCase()).join(' ');

    return `${labelPart} PROFILE URL`;
  }

  private generateUrlPropertyName(name: string): string {
    const tokens = name.split(' ').map((token) => token.toLowerCase());
    return tokens
      .map((token, index) => {
        return index != 0 ? token.charAt(0).toUpperCase() + token.slice(1) : token;
      })
      .join('')
      .concat('Url');
  }

  addUrlGroup() {
    const { name, url } = this.newUrl.value;
    if (name && url) {
      const urlGroup = new FormGroup({
        key: new FormControl<string | null>(this.generateUrlPropertyName(name)),
        value: new FormControl<string | null>(url),
      });

      this.resetForm();
      this.urls.push(urlGroup);
      this.urls.markAsDirty();
      this.formGroup.updateValueAndValidity();
    }
  }

  resetForm() {
    this.newUrl.reset();
    this.newUrl.markAsPristine();
    this.newUrl.markAsUntouched();
    this.newUrl.updateValueAndValidity();
  }

  submit() {
    if (this.urls.pristine) {
      this.snackBar.open('No changes detected. Please modify your profile details before saving.', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.urls.markAllAsTouched();

    if (this.urls.invalid) {
      return;
    }

    this.submitting.set(true);
    const payload = this.urls.value
      .filter((item: any) => item.value !== null)
      .reduce((acc: Record<string, any>, group: any) => {
        acc[group.key] = group.value;
        return acc;
      }, {});

    this.settingsService
      .updateCompany(this.data.companyId, payload)
      .pipe(
        catchError((err) => {
          this.snackBar.open('Social Url update failed. Please try again later.', 'OK', { duration: 3000 });
          return EMPTY;
        }),
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe((res) => {
        this.snackBar.open('Your Social Url has been updated successfully.', 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      });
  }
}
