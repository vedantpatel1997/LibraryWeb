import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BillingBooksInfo,
  BillingDeatils,
  BillingSummary,
} from 'src/app/DTO/BillingDetails';
import { BillingInfo } from 'src/app/DTO/BillingInfo';
import { IssueBook } from 'src/app/DTO/IssueBook';
import { User } from 'src/app/DTO/User';
import { Book } from 'src/app/DTO/book';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  error: boolean = false;
  cartItems: Book[] = [];
  curUserId: number;
  user: User;
  spinnerVisible: boolean = false;
  private taxRate: number = 0.13;

  billingInfo: BillingInfo = {
    quantity: 0,
    totalBookAmount: 0,
    deliveryType: '', // Set to the default option
    deliveryFee: 0,
    tax: 0,
    finalAmount: 0,
    Address: '', // You can set the address based on user data
  };

  constructor(private bookSvc: BooksService, private loginSvc: LoginService) {
    this.curUserId = Number(this.loginSvc.getUserData().userId);
    this.user = loginSvc.getUserData();
  }
  ngOnInit(): void {
    this.getBookData();
  }

  chekoutForm: FormGroup = new FormGroup({
    delivery: new FormControl('home', [Validators.required]),
    rentPeriod: new FormControl('10', [Validators.required]),
  });

  getBookData() {
    if (this.curUserId !== undefined) {
      this.spinnerVisible = true;

      this.bookSvc.getCartItemsByUserId(this.curUserId).subscribe(
        (APIResult) => {
          if (APIResult.isSuccess) {
            this.cartItems = APIResult.data;
            this.cartItems.forEach((cur) => {
              cur.rentPeriod = +this.chekoutForm.controls['rentPeriod'].value;
            });
            this.onRentDaysChage();
            this.calculateBillingInfo();
            this.spinnerVisible = false;
          } else {
            this.error = true;
            // Handle other possible error scenarios here
            this.spinnerVisible = false;
          }
        },
        (error) => {
          // Handle network or unexpected errors here
          this.error = true;
          this.spinnerVisible = false;
        }
      );
    }
  }

  calculateBillingInfo() {
    this.billingInfo.quantity = this.cartItems.length;
    this.billingInfo.deliveryType = this.chekoutForm.controls['delivery'].value;
    this.billingInfo.totalBookAmount = this.calculateTotalBookAmount(); // Implement this function
    this.billingInfo.deliveryFee =
      this.billingInfo.deliveryType == 'pickup' ? 0 : 5.99; // Implement this function
    this.billingInfo.tax = +(
      (this.billingInfo.totalBookAmount + this.billingInfo.deliveryFee) *
      this.taxRate
    ).toFixed(2); // Implement this function
    this.billingInfo.finalAmount = +(
      this.billingInfo.totalBookAmount +
      this.billingInfo.deliveryFee +
      this.billingInfo.tax
    ).toFixed(2); // Implement this function
  }

  calculateTotalBookAmount(): number {
    let totalBookAmount = 0;
    this.cartItems.forEach((cur) => {
      totalBookAmount += cur.totalRentPrice;
    });
    return +totalBookAmount.toFixed(2);
  }

  onRentDaysChage() {
    this.cartItems.forEach((cur) => {
      cur.totalRentPrice = +(
        cur.price +
        (+cur.rentPeriod / 100) * cur.price
      ).toFixed(2);
    });
    this.onDeliveryOptionChange();
  }

  getReturnDate(days: number): string {
    const currentDate = new Date();
    const returnDate = new Date(currentDate);
    returnDate.setDate(currentDate.getDate() + +days);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return returnDate.toLocaleDateString('en-US', options);
  }

  onDeliveryOptionChange() {
    // Update billing info when the delivery option changes
    this.calculateBillingInfo();
  }

  removeFromCart(bookId: number) {
    this.spinnerVisible = true;
    this.bookSvc.removeFromCart(this.curUserId, bookId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage(
            'Item removed from the cart successfully!',
            'success'
          );
          this.getBookData();
        } else {
          this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
          this.spinnerVisible = false;
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
          // Handle unauthorized error if needed
        }
        this.spinnerVisible = false;
        this.error = true;
      },
    });
  }

  getReturnDateForCSharp(days: number): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString();
  }

  save() {
    // Preparin data for issue books
    let issueBookData: IssueBook[] = [];
    this.cartItems.forEach((cartItem) => {
      const issueBook: IssueBook = {
        bookId: cartItem.bookId,
        userId: this.curUserId,
        days: cartItem.rentPeriod,
      };

      issueBookData.push(issueBook);
    });

    // Preparing data for generate bill
    let billingBooksInfo: BillingBooksInfo[] = [];
    this.cartItems.forEach((cur) => {
      const bookInfo: BillingBooksInfo = {
        bookId: cur.bookId,
        rentDays: cur.rentPeriod,
        bookOriginalPrice: cur.price,
        bookRentPrice: cur.totalRentPrice,
      };
      billingBooksInfo.push(bookInfo);
    });

    let billingDetals: BillingDeatils = {
      billingSummary: {
        userId: this.curUserId,
        bookQuantity: this.billingInfo.quantity,
        delivery:
          this.chekoutForm.controls['delivery'].value == 'home' ? true : false,
        pickup:
          this.chekoutForm.controls['delivery'].value == 'pickup'
            ? true
            : false,
        tax: this.billingInfo.tax,
        totalAmount: this.billingInfo.finalAmount,
        addressId: this.user.addressId,
      },
      billingBooksInfo: billingBooksInfo,
      issueDTos: issueBookData,
    };

    if (this.chekoutForm.valid) {
      this.spinnerVisible = true;

      this.bookSvc.issueBooks(billingDetals).subscribe({
        next: (APIResult) => {
          if (APIResult.isSuccess) {
            this.getBookData();
            this.bookSvc.showMessage(
              'Book rented successfully!',
              'success',
              'TOPLevel'
            );
          } else {
            this.bookSvc.showMessage(APIResult.errorMessage, 'warning');
            this.spinnerVisible = false;
          }
        },
        error: (error) => {
          this.spinnerVisible = false;
          if (error.status == 401) {
          }
          this.error = true;
        },
      });
    }
  }
}
