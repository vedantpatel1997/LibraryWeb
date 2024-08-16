import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Book } from '../DTO/book';
import { environment } from '../environments/environment';
import { APIResponse } from '../DTO/APIResponse';
import { IssueBook } from '../DTO/IssueBook';
import { BillingDeatils } from '../DTO/BillingDetails';
import { Category } from '../DTO/Category';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  bookApiUrl = environment.apiAddress + 'Books/';
  categoryApiUrl = environment.apiAddress + 'Category/';
  bookUserTransactionApiUrl =
    environment.apiAddress + 'BooksUsersTransactions/';

  constructor(private http: HttpClient) {}

  createBook(bookData: Book): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.bookApiUrl}Create`, bookData);
  }
  createCategory(categoryData: Category): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.categoryApiUrl}CreateCategory`,
      categoryData
    );
  }
  getAllBooks(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.bookApiUrl + 'GetAllBooks');
  }
  getAllCategories(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.bookApiUrl + 'GetAllCategories');
  }
  addToCart(userId: number, bookId: number): Observable<APIResponse> {
    const body = { userId: userId, bookId: bookId };
    return this.http.post<APIResponse>(`${this.bookApiUrl}AddToCart`, body);
  }
  removeFromCart(userId: number, bookId: number): Observable<APIResponse> {
    const body = { userId: userId, bookId: bookId };

    return this.http.post<APIResponse>(
      `${this.bookApiUrl}RemoveFromCart`,
      body
    );
  }
  issueBooks(billingDeatils: BillingDeatils): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.bookUserTransactionApiUrl}IssueBooks`,
      billingDeatils
    );
  }
  submitBook(SubmitBooksData: {
    bookId: number;
    userId: number;
  }): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.bookUserTransactionApiUrl}SubmitBook`,
      SubmitBooksData
    );
  }
  getAllDueBooks(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetDueBooks`
    );
  }
  getBooksByUserId(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetBooksByUserID?userId=${userId}`
    );
  }
  GetUsersByBookID(bookId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetUsersByBookID?bookId=${bookId}`
    );
  }
  getBookId(bookId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookApiUrl}GetBookById?id=${bookId}`
    );
  }
  updateBook(bookId: number, book: Book): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.bookApiUrl}Update?id=${bookId}`,
      book
    );
  }
  getCartItemsByUserId(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookApiUrl}GetCartItemsByUserId?userId=${userId}`
    );
  }
  getBooksByIds(bookIds: number[]): Observable<APIResponse> {
    // Define the headers if needed
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Make the HTTP POST request with the array of bookIds
    return this.http.post<APIResponse>(
      this.bookApiUrl + 'GetBooksByIds',
      bookIds
    );
  }
  showMessage(message: string, alertType: string = 'info', level: string = '') {
    let alertContainer;
    if (level == '') {
      alertContainer = document.getElementById('liveAlertPlaceholder');
    } else {
      alertContainer = document.getElementById('liveAlertPlaceholder1');
    }

    const validAlertTypes = ['success', 'info', 'warning', 'danger'];

    if (validAlertTypes.includes(alertType)) {
      alertContainer!.innerHTML = `
        <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;

      // Move focus to the error message
      const errorMessageElement = alertContainer!.querySelector('.alert');
      if (errorMessageElement) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      console.error(
        'Invalid alert type. Valid types are: success, info, warning, danger'
      );
    }
  }
  getBookHistoryByUserId(userId: number) {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}getBooksHistoryByUserId?userId=${userId}`
    );
  }
  getUserHistoryByBookId(bookId: number) {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetUsersHistoryByBookId?bookId=${bookId}`
    );
  }
  SendReminderForBooks(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}SendReminderForPendingBooks?userId=${userId}`
    );
  }
  SendReminderForPendingBook(
    userId: number,
    bookId: number
  ): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}SendReminderForPendingBook?userId=${userId}&bookId=${bookId}`
    );
  }
  DeleteBook(bookId: number): Observable<APIResponse> {
    return this.http.delete<APIResponse>(
      `${this.bookApiUrl}Delete?id=${bookId}`
    );
  }
  GenerateBill(billingDetails: BillingDeatils): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.bookUserTransactionApiUrl}GenerateBill`,
      billingDetails
    );
  }
  GetAllBillsByUserId(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetBillsByUserID?userId=${userId}`
    );
  }
  GetBillByBillId(billId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.bookUserTransactionApiUrl}GetBillByBillID?billId=${billId}`
    );
  }
  sendPDF(
    pdfBytes: Uint8Array,
    userId: number,
    pdfName: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'pdf',
      new Blob([pdfBytes], { type: 'application/pdf' }),
      `${pdfName}.pdf`
    );
    formData.append('userId', userId.toString());

    return this.http.post<any>(
      `${this.bookUserTransactionApiUrl}sendPDF`,
      formData
    );
  }
}
