import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registerUser', component: CreateUserComponent },
];

@NgModule({
  declarations: [LoginComponent, CreateUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
})
export class LoginModule {}
