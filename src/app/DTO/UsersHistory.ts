import { User } from './User';
import { Book } from './book';

export interface UsersHistory {
  bookId: number;
  userId: number;
  issueDate: Date;
  returnDate?: Date;
  days: number;
  book: Book;
  user: User;
}
