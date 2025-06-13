import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-personal-information',
  imports: [TitleCasePipe],
  templateUrl: './admin-personal-information.component.html',
  styleUrl: './admin-personal-information.component.scss',
})
export class AdminPersonalInformationComponent {
  userDetail = input<any>({
    userId: 'bee id ',
    user: {
      prefix: 'Mr',
      firstName: 'Bee',
      lastName: 'Ta',
      jobTitle: 'Software Engineer',
      phoneNumber: '123456789',
      email: 'beeta@gmail.com',
    },
  });
  dialog = inject(MatDialog);

  compactName = computed(() => {
    const userValue = this.userDetail();
    if (!userValue) {
      return '';
    }

    const firstName = userValue.user.firstName || '';
    const lastName = userValue.user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  });

  // onEditProfile() {
  //   const dataConfig: MatDialogConfig = {
  //     data: { userInfo: this.userDetail() },
  //     width: '100%',
  //     maxWidth: '980px',
  //   };
  //   const dialogRef = this.dialog.open(EditProfileFormComponent, dataConfig);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // todo
  //       // this.authService.checkToken().subscribe();
  //     }
  //   });
  // }
}
