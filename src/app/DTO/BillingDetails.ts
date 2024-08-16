import { Address } from './Address';
import { IssueBook } from './IssueBook';

export interface BillingDeatils {
  billingSummary: BillingSummary;
  billingBooksInfo: BillingBooksInfo[];
  issueDTos: IssueBook[];
}

export interface BillingSummary {
  billingId?: number;
  userId: number;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPhone?: string;
  date?: Date;
  address?: Address;
  bookQuantity: number;
  delivery: boolean;
  pickup: boolean;
  tax: number;
  totalAmount: number;
  addressId: number;
  billingBooksInfos?: BillingBooksInfo[];
}

export interface BillingBooksInfo {
  BillingBooksInfo?: number;
  bookId: number;
  bookName?: string;
  bookAuthor?: string;
  bookCategory?: string;
  bookImageUrl?: string;
  rentDays: number;
  estimatedReturnDate?: Date;
  bookOriginalPrice: number;
  bookRentPrice: number;
  billingId?: number;
}
