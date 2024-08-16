import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/DTO/User';
import { userCred } from 'src/app/DTO/userCred';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent {
  spinnerVisible: boolean = false;
  curUserId: number;
  userData: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
  };

  updateFrom: boolean = false;

  constructor(
    private userSvc: UsersService,
    private loginSvc: LoginService,
    private bookSvc: BooksService
  ) {
    this.curUserId = Number(this.loginSvc.getUserData().userId);
  }

  ngAfterViewInit(): void {
    this.userForm.controls['dob'].valueChanges.subscribe((res) => {
      const selectedDob = new Date(res);
      const year = selectedDob.getFullYear();
      const curYear = new Date().getFullYear();
      this.userForm.controls['age'].setValue(curYear - year);
    });
  }

  ngOnInit(): void {
    this.disableUpdate();
  }

  userForm: FormGroup = new FormGroup({
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
  });

  getUserData() {
    this.spinnerVisible = true;
    this.userSvc.getUserByUserId(this.curUserId).subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.userData = APIResult.data;
          this.userForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            username: this.userData.username,
            gender: this.userData.gender,
            dob: this.formatDateFromISO8601(this.userData.dob),
            email: this.userData.email,
            phone: this.userData.phone,
          });
          this.spinnerVisible = false;
        } else {
          this.spinnerVisible = false;
        }
      },
      (error) => {
        // Handle network or unexpected errors here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      }
    );
  }

  formatDateFromISO8601(isoString: string): string {
    const date = new Date(isoString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  }

  capitalizeFirstLetter(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  save() {
    if (this.userForm.valid) {
      let userData: User = {
        userId: this.curUserId,
        firstName: this.capitalizeFirstLetter(
          this.userForm.controls['firstName'].value
        ),
        lastName: this.capitalizeFirstLetter(
          this.userForm.controls['lastName'].value
        ),
        username: this.userForm.controls['username'].value,
        dob: this.userForm.controls['dob'].value,
        gender: this.userForm.controls['gender'].value,
        email: this.userForm.controls['email'].value,
        phone: this.userForm.controls['phone'].value,
      };

      this.spinnerVisible = true;

      this.userSvc.updateUser(userData, this.curUserId).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.bookSvc.showMessage(`User succesfully Updated.`, 'success');
            this.userForm.disable();
            this.updateFrom = false;
            this.spinnerVisible = false;
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

  enableUpdate() {
    this.userForm.enable();
    this.userForm.controls['age'].disable();
    this.updateFrom = true;
  }

  disableUpdate() {
    this.getUserData();
    this.userForm.disable();
    this.updateFrom = false;
    let errorArea = document.getElementById('liveAlertPlaceholder');
    if (errorArea !== null) errorArea.innerHTML = '';
  }
}
