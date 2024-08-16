import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './Books/books.component';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from '../Shared/auth.guard';
import { MyBooksComponent } from './my-books/my-books.component';

const routes: Routes = [
  { path: '', component: BooksComponent },
  {
    canActivate: [AuthGuard],
    path: 'Cart',
    component: CartComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'MyBooks',
    component: MyBooksComponent,
  },
  {
    path: 'User',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./UserInfo/user-info.module').then((m) => m.UserInfoModule),
  },
];

@NgModule({
  declarations: [
    BooksComponent,
    ErrorComponent,
    CartComponent,
    MyBooksComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class UserModule {}
