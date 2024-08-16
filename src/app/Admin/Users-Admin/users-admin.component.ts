import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/DTO/User';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';
@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css'],
})
export class UsersAdminComponent {
  curLoggedinUser: User;
  users: User[] = [];
  spinnerVisible: boolean = false;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'dob',
    'gender',
    'email',
    'phone',
    'username',
    'role',
    'action',
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userSvc: UsersService,
    private router: Router,
    private bookSvc: BooksService,
    private loginSvc: LoginService
  ) {
    this.curLoggedinUser = loginSvc.getUserData();
    if (this.curLoggedinUser.role == 'Owner') {
      this.displayedColumns.push('makeAdmin');
    }

    // Assign the data to the data source for the table to render
    this.GetUserData();
  }

  GetUserData() {
    this.spinnerVisible = true;
    this.userSvc.GetAllUsers().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.users = APIResult.data;
          this.users = this.users.filter(
            (user) => user.userId !== Number(this.loginSvc.getUserData().userId)
          );
          this.users.forEach((cur, i) => {
            cur.id = i + 1;
          });
          this.dataSource = new MatTableDataSource(this.users);
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

  showUserDetails(userId: number) {
    this.router.navigateByUrl(`Admin/Users/Info/${userId}`);
  }

  makeAdmin(userId: number) {
    this.spinnerVisible = true;
    this.userSvc.MakeAdmin(userId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.GetUserData();
          this.bookSvc.showMessage(APIResult.errorMessage, 'success');
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
  makeUser(userId: number) {
    this.spinnerVisible = true;
    this.userSvc.MakeUser(userId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.GetUserData();
          this.bookSvc.showMessage(APIResult.errorMessage, 'success');
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
}
