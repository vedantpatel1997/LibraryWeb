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
  }

  logOut() {
    this.loginSvc.logout();
  }
}
