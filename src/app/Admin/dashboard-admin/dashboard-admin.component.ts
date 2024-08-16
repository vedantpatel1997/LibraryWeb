import { Component } from '@angular/core';
import { User } from 'src/app/DTO/User';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent {
  curUserData: User;

  constructor(private loginSvc: LoginService) {}

  ngOnInit() {
    this.loginSvc.isLoggedIn.subscribe((loggedIn) => {
      this.curUserData = this.loginSvc.getUserData();
    });
  }
}
