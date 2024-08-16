import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BooksService } from 'src/app/Services/books.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-user-delete-admin',
  templateUrl: './user-delete-admin.component.html',
  styleUrls: ['./user-delete-admin.component.css'],
})
export class UserDeleteAdminComponent {
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

  DeleteUser() {
    this.spinnerVisible = true;
    this.userSvc.DeleteUser(this.id).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage('Successfully Delete User', 'success');
          setTimeout(() => {
            this.route.navigate(['/Admin/Users']);
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
