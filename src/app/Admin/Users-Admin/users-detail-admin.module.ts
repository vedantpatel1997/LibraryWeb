import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Routes, RouterModule } from '@angular/router';
import { UsersAdminComponent } from './users-admin.component';
import { UserHistoryAdminComponent } from './user-history-admin/user-history-admin.component';
import { UserInfoAdminComponent } from './user-info-admin/user-info-admin.component';
import { UserDeleteAdminComponent } from './user-delete-admin/user-delete-admin.component';
import { UserActivebooksAdminComponent } from './user-activebooks-admin/user-activebooks-admin.component';
import { UserMailAdminComponent } from './user-mail-admin/user-mail-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: UsersAdminComponent },
  { path: 'Info/:id', component: UserInfoAdminComponent },
  { path: 'Delete/:id', component: UserDeleteAdminComponent },
  { path: 'ActiveBooks/:id', component: UserActivebooksAdminComponent },
  { path: 'History/:id', component: UserHistoryAdminComponent },
  { path: 'SendDetails/:id', component: UserMailAdminComponent },
];
@NgModule({
  declarations: [
    UserHistoryAdminComponent,
    UserInfoAdminComponent,
    UserDeleteAdminComponent,
    UserActivebooksAdminComponent,
    UserMailAdminComponent,
    UsersAdminComponent,
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
export class UsersDetailAdminModule {}
