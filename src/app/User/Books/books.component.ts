import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../Services/books.service';
import { Category } from '../../DTO/Category';
import { CategoryService } from '../../Services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';
import { Book } from 'src/app/DTO/book';

@Component({
  selector: 'app-error',
  templateUrl: './books.component.html',
  styles: [
    `
      .card:hover {
        background-color: #f2f2f2; /* Light grey background color on hover */
        transition: background-color 0.3s ease; /* Add a smooth transition effect */
      }
      .low-stock-badge {
        background-color: red;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 10px; /* Add margin to the left of the badge */
      }
      .bestSeller-stock-badge {
        padding: 4px 8px !important;
        border-radius: 4px !important;
        font-size: 14px !important;
      }
    `,
  ],
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  filter: string = '';
  search: string = '';
  error: boolean = false;
  unauthorized: boolean = false;

  constructor(
    private booksSvc: BooksService,
    private loginSvc: LoginService,
    private categorySvc: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filter = params['filter'] ?? '';
    });

    this.categorySvc.getAllCategories().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.categories = APIResult.data;
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
        }
        this.error = true;
        this.booksSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      },
    });

    this.booksSvc.getAllBooks().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.books = APIResult.data;
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
          this.unauthorized = true;
        }
        this.error = true;
        this.booksSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      },
    });
  }

  addToCart(bookId: number) {
    if (!this.loginSvc.getUserData()) {
      this.booksSvc.showMessage('Please login to add book in the cart', 'warning');
      return;
    }
    this.booksSvc
      .addToCart(Number(this.loginSvc.getUserData().userId), bookId)
      .subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.booksSvc.showMessage(
              'Book added to cart successfully!',
              'success'
            );
          }
          if (!APIResult.isSuccess) {
            this.booksSvc.showMessage(APIResult.errorMessage, 'success');
          }
        },
        error: (error) => {
          // Handle the error here
          if (error.status == 401) {
            this.unauthorized = true;
          }
          this.error = true;
        },
      });
  }

  getFilteredProducts() {
    if (!this.books) {
      return [];
    }

    let filteredBooks = this.books;

    if (this.filter !== '') {
      filteredBooks = filteredBooks.filter(
        (book: any) => book.category.name === this.filter
      );
    }

    if (this.search !== '') {
      const searchTerm = this.search.toLowerCase();
      filteredBooks = filteredBooks.filter((book: Book) => {
        return (
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.category.name.toLowerCase().includes(searchTerm)
        );
      });
    }

    return filteredBooks;
  }
}
