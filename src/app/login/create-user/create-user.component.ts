import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/DTO/User';
import { BooksService } from 'src/app/Services/books.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit, AfterViewInit {
  spinnerVisible: boolean = false;
  constructor(
    private userSvc: UsersService,
    private route: Router,
    private bookSvc: BooksService
  ) {}

  ngAfterViewInit(): void {
    this.userForm.controls['dob'].valueChanges.subscribe((res) => {
      const selectedDob = new Date(res);
      const year = selectedDob.getFullYear();
      const curYear = new Date().getFullYear();
      this.userForm.controls['age'].setValue(curYear - year);
    });
  }

  ngOnInit(): void {
    this.userForm.controls['firstName'].valueChanges.subscribe((res) => {
      this.createUsername();
    });
    this.userForm.controls['lastName'].valueChanges.subscribe((res) => {
      this.createUsername();
    });
    this.userForm.controls['dob'].valueChanges.subscribe((res) => {
      this.createUsername();
    });

    this.userForm.controls['password'].valueChanges.subscribe((res) => {
      this.passwordsMatching();
    });
    this.userForm.controls['confirmPassword'].valueChanges.subscribe((res) => {
      this.passwordsMatching();
    });
  }

  userForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      username: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      age: new FormControl({ value: '', disabled: true }),
      email: new FormControl('', [Validators.email, Validators.required]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: (control) => this.passwordsMatching() }
  );

  createUsername() {
    // Get values from form controls
    const firstName = this.userForm.controls['firstName'].value;
    const lastName = this.userForm.controls['lastName'].value;
    const dob = new Date(this.userForm.controls['dob'].value);

    // Extract the last two digits of the birth year
    const birthYear = dob.getFullYear() % 100;

    // Ensure the values are not empty
    if (firstName && lastName && !isNaN(birthYear)) {
      // Create the username
      const username = firstName.charAt(0) + lastName + birthYear;

      // Set the username in the form control
      this.userForm.controls['username'].setValue(username.toLowerCase());
    }
    console.log('CreateUsername');
  }
  capitalizeFirstLetter(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }
  passwordsMatching() {
    if (this.userForm) {
      let pass = this.userForm.controls['password'].value;
      let confirmPass = this.userForm.controls['confirmPassword'].value;
      if (pass != confirmPass) {
        return { passwordsNotMatching: true };
      }
    }
    return null;
  }

  save() {
    if (this.userForm.valid) {
      let userData: User = {
        userId: 0,
        firstName: this.capitalizeFirstLetter(
          this.userForm.controls['firstName'].value
        ),
        lastName: this.capitalizeFirstLetter(
          this.userForm.controls['lastName'].value
        ),
        dob: this.userForm.controls['dob'].value,
        gender: this.userForm.controls['gender'].value,
        email: this.userForm.controls['email'].value,
        phone: this.userForm.controls['phone'].value,
        username: this.userForm.controls['username'].value,
        password: this.userForm.controls['password'].value,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      this.spinnerVisible = true;

      this.userSvc.createUser(userData).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.userForm.reset(); // Reset form values
            this.spinnerVisible = false;
            this.route.navigate(['/login']);
            setTimeout(() => {
              this.bookSvc.showMessage(
                `User succesfully Created. Username: ${APIResult.data.username}, Please Login to continue.`,
                'success'
              );
            }, 1000); // 1000 milliseconds (1 seconds)
          } else {
            this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
            this.spinnerVisible = false;
          }
        },
        error: (error) => {
          // Handle API call errors here
          this.bookSvc.showMessage(
            `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
            'danger'
          );
          this.spinnerVisible = false;
        },
      });
    }
  }
}
