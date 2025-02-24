import { AfterContentInit, Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './Services/login.service';
import { User } from './DTO/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userId: Number | undefined;
  curUser: User | undefined;
  userInfo = {
    isUser: false,
    isAdmin: false,
    isLoggedin: false,
    isOwner: false,
  };
  databaseIsNew = true;
  title = 'LibraryManagement.web';

  constructor(private route: Router, private loginSvc: LoginService) {}

  ngOnInit(): void {
    this.loginSvc.isLoggedIn.subscribe((loggedIn) => {
      this.curUser = this.loginSvc.getUserData();
      if (this.curUser !== null && this.curUser !== undefined) {
        this.userInfo.isLoggedin = true;
        this.userInfo.isUser = this.curUser.role == 'User';
        this.userInfo.isAdmin = this.curUser.role == 'Admin';
        this.userInfo.isOwner = this.curUser.role == 'Owner';
      } else {
        this.loginSvc.removeloggedinData();
        this.userInfo.isLoggedin = false;
        this.userInfo.isUser = false;
        this.userInfo.isAdmin = false;
        this.userInfo.isOwner = false;
      }
    });
    // Fetch current database status on init
    this.checkCurrentDatabase();
  }

  logOut() {
    this.loginSvc.logout();
  }

  switchDatabase(dbToChange: string) {
    // Make API call to switch the database
    this.loginSvc.switchDatabase(dbToChange).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          // Update `databaseIsNew` based on the target database
          this.databaseIsNew = dbToChange === 'new';
          console.log('Database switched successfully');
          this.loginSvc.logout();
        } else {
          // Keep the current database state if switching fails
          console.error('Switch database failed:', APIResult.errorMessage);
        }
      },
      error: (error) => {
        console.error('Error switching database:', error);
      },
    });
  }

  checkCurrentDatabase() {
    this.loginSvc.getCurrentDatabase().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.databaseIsNew = APIResult.data; // Assuming API returns true for 'new' DB
          console.log(
            `Current database: ${this.databaseIsNew ? 'new' : 'old'}`
          );
        } else {
          console.error(
            'Failed to fetch current database:',
            APIResult.errorMessage
          );
        }
      },
      error: (error) => {
        console.error('Error fetching current database:', error);
      },
    });
  }
}
