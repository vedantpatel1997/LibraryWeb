import { User } from './User';
import { Book } from './book';

export interface IssueBook {
  bookId: number;
  userId: number;
  days: number;
  issueDate?: string;
  book?: Book;
  user?: User;
  id?: number;

  // Properties created for specific purpose only (temparory).
  estReturnDate?: string;
  daysRemaining?: number;
  fullName?: string;
}
