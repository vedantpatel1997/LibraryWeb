export interface BooksHistory {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  issueDate: Date;
  returnDate: Date;
  days: number;
}
