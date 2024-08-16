import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Book } from 'src/app/DTO/book';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-books-admin',
  templateUrl: './books-admin.component.html',
  styleUrls: ['./books-admin.component.css'],
})
export class BooksAdminComponent {
  books: Book[] = [];
  spinnerVisible: boolean = false;

  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'categoryName',
    'price',
    'totalQuantity',
    'availableQuantity',
    'issuedQuantity',
    'action',
  ];
  dataSource: MatTableDataSource<Book>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bookSvc: BooksService, private router: Router) {
    // Assign the data to the data source for the table to render

    this.spinnerVisible = true;
    this.bookSvc.getAllBooks().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.books = APIResult.data;
          this.books.forEach((cur, i) => {
            cur.categoryName = cur.category.name;
            cur.id = i + 1;
          });
          this.dataSource = new MatTableDataSource(this.books);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showBookDetails(bookId: number) {
    this.router.navigateByUrl(`Admin/Books/Info/${bookId}`);
  }
}
