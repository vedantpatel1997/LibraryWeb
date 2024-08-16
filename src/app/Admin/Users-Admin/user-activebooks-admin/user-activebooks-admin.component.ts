import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueBook } from 'src/app/DTO/IssueBook';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-user-activebooks-admin',
  templateUrl: './user-activebooks-admin.component.html',
  styleUrls: ['./user-activebooks-admin.component.css'],
})
export class UserActivebooksAdminComponent {
  myBooks: IssueBook[] = [];
  curUserId: number;
  spinnerVisible: boolean = false;

  constructor(private route: ActivatedRoute, private bookSvc: BooksService) {
    this.route.params.subscribe((p) => {
      this.curUserId = p['id'];
    });
  }

  ngOnInit(): void {
    this.getBooksforCurUser();
  }

  getBooksforCurUser() {
    this.spinnerVisible = true;
    this.bookSvc.getBooksByUserId(this.curUserId).subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.myBooks = APIResult.data;
          this.spinnerVisible = false;
        } else {
          this.spinnerVisible = false;
        }
      },
      (error) => {
        // Handle network or unexpected errors here
        this.spinnerVisible = false;
      }
    );
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

  submitBook(bookId: number) {
    let submitData = {
      bookId: bookId,
      userId: this.curUserId,
    };
    this.spinnerVisible = true;
    this.bookSvc.submitBook(submitData).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.getBooksforCurUser();
          this.bookSvc.showMessage('Successfully submited Book !', 'success');
        } else {
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
          this.spinnerVisible = false;
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
          this.spinnerVisible = false;
        }
      },
    });
  }
}
