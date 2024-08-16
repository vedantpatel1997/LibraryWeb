import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/DTO/Category';
import { Book } from 'src/app/DTO/book';
import { BooksService } from 'src/app/Services/books.service';
import { CategoryService } from 'src/app/Services/category.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-add-new-book',
  templateUrl: './add-new-book.component.html',
  styleUrls: ['./add-new-book.component.css'],
})
export class AddNewBookComponent {
  spinnerVisible: boolean = false;
  categoryData: Category[];

  constructor(
    private bookSvc: BooksService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spinnerVisible = true;
    this.categorySvc.getAllCategories().subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.categoryData = APIResult.data;
          this.spinnerVisible = false;
        } else {
          this.bookSvc.showMessage(APIResult.errorMessage, 'danger');
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

  save() {
    if (this.bookForm.valid) {
      let bookData: Book = {
        title: this.bookForm.controls['title'].value,
        author: this.bookForm.controls['author'].value,
        totalQuantity: this.bookForm.controls['totalQuantity'].value,
        categoryId: this.bookForm.controls['category'].value,
        price: this.bookForm.controls['price'].value,
        imageURL: this.bookForm.controls['imageURL'].value,
      };

      this.spinnerVisible = true;

      this.bookSvc.createBook(bookData).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.bookSvc.showMessage(
              `${APIResult.data.title} Succesfully Added.`,
              'success'
            );
            this.bookForm.reset();
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
}
