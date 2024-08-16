import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IssueBook } from 'src/app/DTO/IssueBook';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-due-books',
  templateUrl: './due-books.component.html',
  styleUrls: ['./due-books.component.css'],
})
export class DueBooksComponent {
  spinnerVisible: boolean = false;
  dueBooks: IssueBook[] = [];
  constructor(private bookSvc: BooksService) {}

  displayedColumns: string[] = [
    'id',
    'bookName',
    'userName',
    'issueDate',
    'estimatedReturnDate',
    'daysRemaining',
    'action',
  ];
  dataSource: MatTableDataSource<IssueBook>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.spinnerVisible = true;
    this.bookSvc.getAllDueBooks().subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          APIResult.data.forEach((cur, i) => {
            cur.id = i + 1;
            cur.estReturnDate = this.getEstimateReturnDate(
              cur.days,
              cur.issueDate
            );
            cur.daysRemaining = this.calculateDaysRemaining(cur.estReturnDate);
            cur.fullName = cur.user.firstName + ' ' + cur.user.lastName;
          });

          this.dueBooks = APIResult.data;
          this.dataSource = new MatTableDataSource(this.dueBooks);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
