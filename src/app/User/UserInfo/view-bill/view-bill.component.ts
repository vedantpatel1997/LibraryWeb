import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillingSummary } from 'src/app/DTO/BillingDetails';
import { BooksService } from 'src/app/Services/books.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
})
export class ViewBillComponent {
  curBill: number | undefined;
  spinnerVisible: boolean = false;
  billingDetails: BillingSummary | undefined;
  totalRentedBooksPrice: number = 0;
  penalty: boolean = false;
  constructor(private route: ActivatedRoute, private bookSvc: BooksService) {
    this.route.params.subscribe((p) => {
      this.curBill = p['billId'];
    });
  }

  ngOnInit(): void {
    this.spinnerVisible = true;
    this.bookSvc.GetBillByBillId(this.curBill).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.billingDetails = APIResult.data;
          if (
            this.billingDetails.pickup == false &&
            this.billingDetails.delivery == false
          ) {
            this.penalty = true;
          }
          this.billingDetails.billingBooksInfos.forEach(
            (cur) => (this.totalRentedBooksPrice += cur.bookRentPrice)
          );
          this.spinnerVisible = false;
        }
        this.spinnerVisible = false;
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
  sendEmail(userId: number) {
    console.log('sednEmail');

    const invoiceName = document
      .getElementById('invoiceId')
      .innerText.trim()
      .replace('Paid', '')
      .trim();
    let options = {
      margin: 0,
      filename: `${invoiceName}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const pEl = document.getElementById('myInvoice');
    console.log(pEl);
    let pdfBytes = html2pdf().from(pEl).set(options);

    this.spinnerVisible = true;
    this.bookSvc.sendPDF(pdfBytes, userId, invoiceName).subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.bookSvc.showMessage(`Successfully sent bill`, 'success');
          this.spinnerVisible = false;
        }
        this.spinnerVisible = false;
      },
      error: (error) => {
        // Handle the error here
        this.spinnerVisible = false;
        this.bookSvc.showMessage(
          `<i class="fa-solid fa-triangle-exclamation fa-lg"></i> Something went wrong while getting the data!`,
          'danger'
        );
      },
    });
  }
  downloadPDF() {
    const invoiceName = document
      .getElementById('invoiceId')
      .innerText.trim()
      .replace('Paid', '')
      .trim();

    let options = {
      margin: 0,
      filename: `${invoiceName}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      exclude: ['d-print-none'],
    };

    const pEl = document.getElementById('myInvoice');
    html2pdf().from(pEl).set(options).save();
  }
  formatBillNumber(billNumber: number): string {
    return `LMS${billNumber.toString().padStart(4, '0')}`;
  }
}
