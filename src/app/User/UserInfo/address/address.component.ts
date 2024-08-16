import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/DTO/Address';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  spinnerVisible: boolean = false;
  curUserId: number;
  isDataArrived: boolean = false;
  isAddressRegistered: boolean = true;
  updateFrom: boolean = false;
  addressData: Address = {
    addressId: 0,
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
  };

  constructor(
    private userSvc: UsersService,
    private loginSvc: LoginService,
    private bookSvc: BooksService
  ) {
    this.curUserId = Number(this.loginSvc.getUserData().userId);
  }
  ngOnInit() {
    this.Start();
  }

  addressForm: FormGroup = new FormGroup({
    address1: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    address2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    postal: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  Start() {
    this.isDataArrived = false;
    this.isAddressRegistered = true;
    this.updateFrom = false;
    this.addressData = {
      addressId: 0,
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      country: '',
      postalcode: '',
    };
    this.getAddress();
  }

  getAddress() {
    this.spinnerVisible = true;
    this.userSvc.GetAddressByUserId(this.curUserId).subscribe(
      (APIResult) => {
        if (APIResult.isSuccess) {
          this.addressData = APIResult.data;
          this.addressForm.patchValue({
            city: this.addressData.city,
            province: this.addressData.province,
            country: this.addressData.country,
            postal: this.addressData.postalcode,
            address1: this.addressData.addressLine1,
            address2: this.addressData.addressLine2,
          });
          this.isDataArrived = true;
          this.updateFrom = false;
          this.spinnerVisible = false;
          this.isAddressRegistered = true;
          this.addressForm.disable();
        }
        if (!APIResult.isSuccess) {
          this.isAddressRegistered = false;
          this.addressForm.disable();
          this.spinnerVisible = false;
          this.isDataArrived = true;
        }
      },
      (error) => {
        this.spinnerVisible = false;
        // Handle network or unexpected errors here
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      }
    );
  }

  capitalizeFirstLetter(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  save() {
    if (this.addressForm.valid) {
      this.spinnerVisible = true;
      this.addressData = {
        addressId: this.addressData.addressId,
        addressLine1: this.capitalizeFirstLetter(
          this.addressForm.controls['address1'].value
        ),
        addressLine2: this.capitalizeFirstLetter(
          this.addressForm.controls['address2'].value
        ),
        city: this.capitalizeFirstLetter(
          this.addressForm.controls['city'].value
        ),
        province: this.capitalizeFirstLetter(
          this.addressForm.controls['province'].value
        ),
        country: this.capitalizeFirstLetter(
          this.addressForm.controls['country'].value
        ),
        postalcode: this.capitalizeFirstLetter(
          this.addressForm.controls['postal'].value
        ),
      };

      if (this.isAddressRegistered) {
        this.userSvc.updateAddress(this.addressData, this.curUserId).subscribe({
          next: (APIResult) => {
            if (APIResult.isSuccess) {
              this.bookSvc.showMessage(
                `Address succesfully Updated.`,
                'success'
              );
              this.spinnerVisible = false;

              this.disableUpdate();
            } else {
              this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
              this.spinnerVisible = false;
            }
          },
          error: (error) => {
            // Handle API call errors here
            this.bookSvc.showMessage(
              `<i class="fa-solid fa-triangle-exclamation fa-lg"></i> Something went wrong !`,
              'warning'
            );
            this.spinnerVisible = false;
          },
        });
      }
      if (!this.isAddressRegistered) {
        this.userSvc.createAddress(this.addressData, this.curUserId).subscribe({
          next: (APIResult) => {
            if (APIResult.isSuccess) {
              this.bookSvc.showMessage(`Address succesfully Added.`, 'success');
              this.disableUpdate();
              this.spinnerVisible = false;
            } else {
              this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
              this.spinnerVisible = false;
            }
          },
          error: (error) => {
            // Handle API call errors here
            this.bookSvc.showMessage(
              `<i class="fa-solid fa-triangle-exclamation fa-lg"></i> Something went wrong !`,
              'warning'
            );
            this.spinnerVisible = false;
          },
        });
      }
    }
  }

  enableUpdate() {
    this.addressForm.enable();
    this.updateFrom = true;
  }

  disableUpdate() {
    this.addressForm.reset();
    this.isDataArrived = false;
    this.isAddressRegistered = true;
    this.updateFrom = false;
    this.getAddress();
    this.addressForm.disable();
    this.updateFrom = false;
    this.addressData = {
      addressId: 0,
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      country: '',
      postalcode: '',
    };
    // let errorArea = document.getElementById('liveAlertPlaceholder');
    // if (errorArea !== null) errorArea.innerHTML = '';
  }
}
