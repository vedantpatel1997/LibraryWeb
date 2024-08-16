import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksHistory } from 'src/app/DTO/BooksHistory';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-user-history-admin',
  templateUrl: './user-history-admin.component.html',
  styleUrls: ['./user-history-admin.component.css'],
})
export class UserHistoryAdminComponent {
  curUserId: number;
  spinnerVisible: boolean = false;
  booksHistory: BooksHistory[] = [];

  constructor(private route: ActivatedRoute, private bookSvc: BooksService) {
    this.route.params.subscribe((p) => {
      this.curUserId = p['id'];
    });
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
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
        this.spinnerVisible = false;
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
