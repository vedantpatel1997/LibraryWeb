import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/DTO/Category';
import { BooksService } from 'src/app/Services/books.service';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.css'],
})
export class AddNewCategoryComponent {
  spinnerVisible: boolean = false;

  constructor(private bookSvc: BooksService, private route: Router) {}
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    imageURL: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  save() {
    if (this.categoryForm.valid) {
      let categoryData: Category = {
        name: this.categoryForm.controls['name'].value,
        imageURL: this.categoryForm.controls['imageURL'].value,
      };

      this.spinnerVisible = true;

      this.bookSvc.createCategory(categoryData).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            // this.route.navigateByUrl('Admin/AddBook');
            this.bookSvc.showMessage(
              `${APIResult.data.title} Succesfully added category.`,
              'success'
            );
            this.categoryForm.reset();
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
