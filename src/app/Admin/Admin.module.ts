import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AuthGuard } from '../Shared/auth.guard';
import { roleGuard } from '../Shared/role.guard';
import { AddNewBookComponent } from './add-new-book/add-new-book.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import { DueBooksComponent } from './due-books/due-books.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: 'Books',
    canActivate: [roleGuard],
    loadChildren: () =>
      import('./Books-Admin/book-detail-admin.module').then(
        (m) => m.BookDetailAdminModule
      ),
  },
  {
    path: 'Dashboard',
    component: DashboardAdminComponent,
    canActivate: [roleGuard],
  },
  {
    path: 'Users',
    canActivate: [roleGuard],
    loadChildren: () =>
      import('./Users-Admin/users-detail-admin.module').then(
        (m) => m.UsersDetailAdminModule
      ),
  },
  { path: 'AddBook', component: AddNewBookComponent, canActivate: [roleGuard] },
  {
    path: 'AddCategory',
    component: AddNewCategoryComponent,
    canActivate: [roleGuard],
  },
  { path: 'DueBooks', component: DueBooksComponent, canActivate: [roleGuard] },
];

@NgModule({
  declarations: [
    DashboardAdminComponent,
    AddNewBookComponent,
    AddNewCategoryComponent,
    DueBooksComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
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
export class AdminModule {}
