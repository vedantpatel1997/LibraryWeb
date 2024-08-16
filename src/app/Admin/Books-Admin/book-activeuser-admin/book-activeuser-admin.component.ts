import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersHistory } from 'src/app/DTO/UsersHistory';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-book-activeuser-admin',
  templateUrl: './book-activeuser-admin.component.html',
  styleUrls: ['./book-activeuser-admin.component.css'],
})
export class BookActiveuserAdminComponent {
  curBookId: number;
  spinnerVisible: boolean = false;
  usersHistory: UsersHistory[];

  constructor(private route: ActivatedRoute, private bookSvc: BooksService) {
    this.route.params.subscribe((p) => {
      this.curBookId = p['id'];
    });
  }

  ngOnInit(): void {
    this.spinnerVisible = true;
    this.bookSvc.GetUsersByBookID(this.curBookId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.usersHistory = APIResult.data;
          this.spinnerVisible = false;
        } else {
          this.spinnerVisible = false;
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
        }
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getEstimateReturnDate(days: number, issueDate: string): string {
    const issueDateObj = new Date(issueDate);
    const returnDateObj = new Date(
      issueDateObj.getTime() + days * 24 * 60 * 60 * 1000
    ); // Add days in milliseconds

    return returnDateObj.toISOString(); // Returns the calculated date in the ISO format
  }

  calculateDaysRemaining(endDate: string): number {
    const currentDate = new Date();
    const endDateObj = new Date(endDate);

    // Set both dates to midnight (00:00:00) to ensure accurate day count
    currentDate.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const timeDifference = endDateObj.getTime() - currentDate.getTime();

    // Calculate the number of days remaining
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }

  sendReminder(userId: number, bookId: number) {
    this.spinnerVisible = true;
    this.bookSvc.SendReminderForPendingBook(userId, bookId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage('Succesfullt send reminder', 'success');
          this.spinnerVisible = false;
        } else {
          this.spinnerVisible = false;
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
        }
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }
}
