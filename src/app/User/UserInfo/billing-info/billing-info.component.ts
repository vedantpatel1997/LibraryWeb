import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BillingDeatils, BillingSummary } from 'src/app/DTO/BillingDetails';
import { BooksService } from 'src/app/Services/books.service';
import { LoginService } from 'src/app/Services/login.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.css'],
})
export class BillingInfoComponent {
  billingDetails: BillingSummary[] = [];
  curUserId: number;
  spinnerVisible: boolean = false;

  constructor(
    private userSvc: UsersService,
    private loginSvc: LoginService,
    private bookSvc: BooksService,
    private router: Router
  ) {
    this.curUserId = this.curUserId = Number(
      this.loginSvc.getUserData().userId
    );
  }

  ngOnInit(): void {
    this.spinnerVisible = true;
    this.bookSvc.GetAllBillsByUserId(this.curUserId).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.billingDetails = APIResult.data;
          this.spinnerVisible = false;
        }
      },
      error: (error) => {
        // Handle the error here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i>  Something went wrong while getting the data!`,
          'danger'
        );
      },
    });
  }

  viewBill(billingId: number) {
    this.router.navigateByUrl(`Books/User/ViewBill/${billingId}`);
  }

  formatBillNumber(billNumber: number): string {
    return `LMS${billNumber.toString().padStart(4, '0')}`;
  }
}
