import { Component, OnInit } from '@angular/core';
import { BooksHistory } from 'src/app/DTO/BooksHistory';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  booksHistory: BooksHistory[] = [];
  curUserId: number;
  spinnerVisible: boolean = false;

  constructor(
    private userSvc: UsersService,
    private loginSvc: LoginService,
    private bookSvc: BooksService
  ) {
    this.curUserId = Number(this.loginSvc.getUserData().userId);
  }

  ngOnInit(): void {
    this.spinnerVisible = true;
    this.bookSvc.getBookHistoryByUserId(this.curUserId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.booksHistory = APIResult.data;
          this.spinnerVisible = false;
        }
      },
      error: (error) => {
        // Handle the error here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      },
    });
  }

  calculateSubmitOnTime(
    returnDate: Date,
    issueDate: Date,
    days: number
  ): string {
    const returnDateObj = new Date(returnDate);
    const issueDateObj = new Date(issueDate);

    // Calculate the time difference in milliseconds
    const timeDifference = returnDateObj.getTime() - issueDateObj.getTime();
    // Calculate the number of days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const lateDays = days - daysDifference;
    if (lateDays < 0) return `${lateDays} Days Late`;

    return `Yes`;
  }

  submitLate(returnDate: Date, issueDate: Date, days: number): boolean {
    const returnDateObj = new Date(returnDate);
    const issueDateObj = new Date(issueDate);

    // Calculate the time difference in milliseconds
    const timeDifference = returnDateObj.getTime() - issueDateObj.getTime();
    // Calculate the number of days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const lateDays = days - daysDifference;
    if (lateDays < 0) return true;

    return false;
  }
}
