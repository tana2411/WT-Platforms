import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'app/models';
import { AuthService } from 'app/services/auth.service';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  imports: [MatButtonModule, MatIconModule, TitleCasePipe],
})
export class MyProfileComponent {
  @Input() user: User | undefined | null;

  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  userInitials = computed(() => {
    if (this.user) {
      const firstName = this.user?.user.firstName || '';
      const lastName = this.user?.user.lastName || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  });

  onEditProfile() {
    const dataConfig: MatDialogConfig = {
      data: { userInfo: this.user },
    };
    const dialogRef = this.dialog.open(EditProfileFormComponent, dataConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.checkToken().subscribe();
      }
    });
  }
}
