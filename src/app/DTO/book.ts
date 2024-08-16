import { Category } from './Category';

export interface Book {
  id?: number;
  bookId?: number;
  title: string;
  author: string;
  imageURL: string;
  totalQuantity: number;
  availableQuantity?: number;
  issuedQuantity?: number;
  price: number;
  category?: Category;
  categoryId: number;
  rentPeriod?: number;
  totalRentPrice?: number;
  categoryName?: string;
  isBestSeller?: boolean;
}
