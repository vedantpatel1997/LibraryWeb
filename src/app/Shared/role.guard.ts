import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { LoginService } from '../Services/login.service';
import { Observable } from 'rxjs';
import { User } from '../DTO/User';

@Injectable({
  providedIn: 'root',
})
export class roleGuard {
  constructor(private router: Router, private loginSvc: LoginService) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let loggedInUser = this.loginSvc.getUserData();

    if (loggedInUser == null || loggedInUser == undefined) {
      this.loginSvc.removeloggedinData();
      alert('Authorization failed. Please login to continue');
      this.router.navigate(['/login']);
      return false;
    }

    if (loggedInUser.role == 'Admin' || loggedInUser.role == 'Owner') {
      return true;
    } else {
      alert('You dont have permission to access this page.');
      this.router.navigateByUrl('');
      return false;
    }
  }
}
