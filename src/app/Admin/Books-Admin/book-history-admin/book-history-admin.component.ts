import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersHistory } from 'src/app/DTO/UsersHistory';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-book-history-admin',
  templateUrl: './book-history-admin.component.html',
  styleUrls: ['./book-history-admin.component.css'],
})
export class BookHistoryAdminComponent {
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
    this.bookSvc.getUserHistoryByBookId(this.curBookId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.usersHistory = APIResult.data || [];
          this.spinnerVisible = false;
        }
        this.spinnerVisible = false;
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
