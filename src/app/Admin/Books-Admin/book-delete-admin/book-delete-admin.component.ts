import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/Services/books.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-book-delete-admin',
  templateUrl: './book-delete-admin.component.html',
  styleUrls: ['./book-delete-admin.component.css'],
})
export class BookDeleteAdminComponent {
  id: number;
  spinnerVisible: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private userSvc: UsersService,
    private bookSvc: BooksService,
    private route: Router
  ) {
    this.router.params.subscribe((p) => {
      this.id = p['id'];
    });
  }

  DeleteBook() {
    this.spinnerVisible = true;
    this.bookSvc.DeleteBook(this.id).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage('Successfully Delete Book', 'success');
          setTimeout(() => {
            this.route.navigate(['/Admin/Books']);
          }, 1000); // 2000 milliseconds (2 seconds)
        } else if (!APIResult.isSuccess) {
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
        }
        this.spinnerVisible = false;
      },
      error: (error) => {
        // Handle the error here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while fetching the data!`,
          'danger'
        );
        this.spinnerVisible = false;
      },
    });
  }
}
