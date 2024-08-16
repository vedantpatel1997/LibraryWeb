import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private loginSvc: LoginService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let loggedInUser = this.loginSvc.getUserData();

    if (loggedInUser == null || loggedInUser == undefined) {
      this.loginSvc.logout();
      alert('Authorization failed. Please login');
      this.router.navigate(['/login']);
      return false;
    }
    if (
      loggedInUser.role == 'User' ||
      loggedInUser.role == 'Owner' ||
      loggedInUser.role == 'Admin'
    ) {
      return true;
    } else {
      alert('You dont have permission to access this page.');
      this.router.navigateByUrl('');
      return false;
    }
  }
}
