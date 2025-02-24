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
  databaseIsNew;
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
    const confirmSwitch = confirm(
      `You are about to switch to the ${dbToChange.toUpperCase()} database. This will log you out and redirect you to the home page. Do you want to continue?`
    );
  
    if (!confirmSwitch) {
      return;
    }
  
    // Make API call to switch the database
    this.loginSvc.switchDatabase(dbToChange).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          // Update `databaseIsNew` based on the target database
          this.databaseIsNew = dbToChange === 'new';
          alert('Database switched successfully! You will be logged out.');
          
          // Logout and redirect
          this.loginSvc.logout();
        } else {
          // Show error alert if switching fails
          alert(`Switch database failed: ${APIResult.errorMessage}`);
          console.error('Switch database failed:', APIResult.errorMessage);
        }
      },
      error: (error) => {
        alert('Error switching database. Please try again later.');
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
