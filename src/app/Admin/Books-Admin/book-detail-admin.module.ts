import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BookInfoAdminComponent } from './book-info-admin/book-info-admin.component';
import { BooksAdminComponent } from './books-admin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BookDeleteAdminComponent } from './book-delete-admin/book-delete-admin.component';
import { BookActiveuserAdminComponent } from './book-activeuser-admin/book-activeuser-admin.component';
import { BookHistoryAdminComponent } from './book-history-admin/book-history-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: BooksAdminComponent },
  { path: 'Info/:id', component: BookInfoAdminComponent },
  { path: 'Delete/:id', component: BookDeleteAdminComponent },
  { path: 'ActiveUser/:id', component: BookActiveuserAdminComponent },
  { path: 'History/:id', component: BookHistoryAdminComponent },
];
@NgModule({
  declarations: [
    BookInfoAdminComponent,
    BooksAdminComponent,
    BookDeleteAdminComponent,
    BookActiveuserAdminComponent,
    BookHistoryAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class BookDetailAdminModule {}
