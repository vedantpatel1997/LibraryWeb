import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { userCred } from '../DTO/userCred';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { UsersService } from '../Services/users.service';
import { BooksService } from '../Services/books.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      /* Add this CSS to your component's stylesheet or a global stylesheet */
      .form-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%; /* Ensure the container covers the full form area */
        background-color: rgba(
          255,
          255,
          255,
          0.5
        ); /* Increase the transparency */
      }

      .transparent {
        opacity: 0.5;
        transition: opacity 1s;
      }

      .spinner-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1; /* Ensure it's above the form */
        display: flex;
        align-items: center;
        justify-content: center;
        background: none; /* Remove background from the spinner-container */
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  spinnerVisible: boolean = false;

  constructor(
    private loginSvc: LoginService,
    private bookSvc: BooksService,
    private route: Router,
    private userService: UsersService
  ) {}

  loginForm: FormGroup = new FormGroup({
    emailOrUsername: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  ngOnInit(): void {
    // this.loginForm.controls['emailOrUsername'].valueChanges.subscribe((res) => {
    //   console.log(this.loginForm.controls['emailOrUsername']);
    // });
  }
  save() {
    const loginData: userCred = {
      username: this.loginForm.controls['emailOrUsername'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.spinnerVisible = true;
    this.loginSvc.generateToken(loginData).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.loginSvc.setData(APIResult);
          this.loginSvc.login();
          if (
            this.loginSvc.haveAccess('Admin') ||
            this.loginSvc.haveAccess('Owner')
          ) {
            this.route.navigate(['/Admin/Dashboard']);
          } else if (this.loginSvc.haveAccess('User')) {
            this.route.navigate(['']);
          }
        } else {
          this.bookSvc.showMessage(APIResult.errorMessage, 'danger');
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

    // .pipe(
    //   switchMap((APIResult) => {
    //     if (APIResult.isSuccess) {
    //       this.loginSvc.saveTokens(APIResult.data);

    //       // Check user role and make the second API call if needed

    //       let curuserId = this.loginSvc.getLoggedinUserId();
    //       if (curuserId !== undefined && !isNaN(curuserId as number)) {
    //         // Return the result of the second API call (makeAnotherAPICall)
    //         return this.userService.getUserByUserId(curuserId as number);
    //       }

    //       // Return an empty observable if no second API call is needed
    //       return of(undefined);
    //     } else {
    //       this.bookSvc.showMessage('Invalid Credentails');
    //       return of(undefined);
    //     }
    //   })
    // )
    // .subscribe(
    //   (APIResult) => {
    //     if (APIResult?.isSuccess) {
    //       // Handle the result of the additional API call
    //       this.loginSvc.saveUserData(APIResult.data);
    //       this.loginSvc.login();
    //       if (
    //         this.loginSvc.haveAccess('Admin') ||
    //         this.loginSvc.haveAccess('Owner')
    //       ) {
    //         this.route.navigate(['/Admin/Dashboard']);
    //       } else if (this.loginSvc.haveAccess('User')) {
    //         this.route.navigate(['']);
    //       }
    //     }

    //     this.spinnerVisible = false;
    //   },
    //   (error) => {
    //     this.spinnerVisible = false;
    //     // Handle errors
    //     this.bookSvc.showMessage(
    //       `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
    //       'danger'
    //     );
    //   }
    // );
  }
}
