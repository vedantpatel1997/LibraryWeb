import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from 'src/app/Services/books.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-user-mail-admin',
  templateUrl: './user-mail-admin.component.html',
  styleUrls: ['./user-mail-admin.component.css'],
})
export class UserMailAdminComponent {
  id: number;
  spinnerVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userSvc: UsersService,
    private bookSvc: BooksService
  ) {
    this.route.params.subscribe((p) => {
      this.id = p['id'];
    });
  }
  sendResetPasswordLink() {
    this.spinnerVisible = true;
    this.userSvc.SendResetPassword(this.id).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage(
            'Successfully Sent new temparory password',
            'success'
          );
        }
        this.spinnerVisible = false;
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while fetching the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }

  sendMailAboutPersonalInfo() {
    this.spinnerVisible = true;
    this.userSvc.SendUserInfo(this.id).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage(
            'Successfully Sent Personal Info',
            'success'
          );
        }
        this.spinnerVisible = false;
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while fetching the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }

  sendReminder() {
    this.spinnerVisible = true;
    this.bookSvc.SendReminderForBooks(this.id).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage('Successfully Sent Reminder', 'success');
        }
        this.spinnerVisible = false;
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while fetching the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }
}
