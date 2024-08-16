import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/DTO/Category';
import { User } from 'src/app/DTO/User';
import { Book } from 'src/app/DTO/book';
import { BooksService } from 'src/app/Services/books.service';
import { CategoryService } from 'src/app/Services/category.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-book-info-admin',
  templateUrl: './book-info-admin.component.html',
  styleUrls: ['./book-info-admin.component.css'],
})
export class BookInfoAdminComponent {
  spinnerVisible: boolean = false;
  curBookId: number;
  bookData: Book;
  categoryData: Category[];
  updateFrom: boolean = false;

  constructor(
    private userSvc: UsersService,
    private loginSvc: LoginService,
    private bookSvc: BooksService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((p) => {
      this.curBookId = p['id'];
    });
  }

  ngOnInit(): void {
    this.disableUpdate();
    this.categorySvc.getAllCategories().subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.categoryData = APIResult.data;
        } else {
        }
      },
      (error) => {
        // Handle network or unexpected errors here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      }
    );
  }

  bookForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    author: new FormControl('', [Validators.required, Validators.minLength(3)]),
    imageURL: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    totalQuantity: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  });

  getBookData() {
    this.spinnerVisible = true;
    this.bookSvc.getBookId(this.curBookId).subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookData = APIResult.data;
          this.bookForm.patchValue({
            title: this.bookData.title,
            author: this.bookData.author,
            totalQuantity: this.bookData.totalQuantity,
            category: this.bookData.categoryId,
            price: this.bookData.price,
            imageURL: this.bookData.imageURL,
          });
          this.spinnerVisible = false;
        } else {
          this.spinnerVisible = false;
        }
      },
      (error) => {
        // Handle network or unexpected errors here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      }
    );
  }

  save() {
    if (this.bookForm.valid) {
      let bookData: Book = {
        bookId: this.curBookId,
        title: this.bookForm.controls['title'].value,
        author: this.bookForm.controls['author'].value,
        totalQuantity: this.bookForm.controls['totalQuantity'].value,
        categoryId: this.bookForm.controls['category'].value,
        price: this.bookForm.controls['price'].value,
        imageURL: this.bookForm.controls['imageURL'].value,
      };

      this.spinnerVisible = true;

      this.bookSvc.updateBook(this.curBookId, bookData).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.bookSvc.showMessage(`Book succesfully Updated.`, 'success');
            this.bookForm.disable();
            this.updateFrom = false;
            this.spinnerVisible = false;
          } else {
            this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
            this.spinnerVisible = false;
          }
        },
        error: (error) => {
          // Handle API call errors here
          this.bookSvc.showMessage(
            `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
            'danger'
          );
          this.spinnerVisible = false;
        },
      });
    }
  }

  enableUpdate() {
    this.bookForm.enable();
    this.updateFrom = true;
  }

  disableUpdate() {
    this.getBookData();
    this.bookForm.disable();
    this.updateFrom = false;
    let errorArea = document.getElementById('liveAlertPlaceholder');
    if (errorArea !== null) errorArea.innerHTML = '';
  }
}
