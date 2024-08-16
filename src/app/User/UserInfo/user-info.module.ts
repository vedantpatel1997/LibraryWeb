import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info/user-info.component';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { HistoryComponent } from './history/history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from './password/password.component';
import { BillingInfoComponent } from './billing-info/billing-info.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

const routes: Routes = [
  { path: 'Info', component: UserInfoComponent },
  { path: 'Address', component: AddressComponent },
  { path: 'History', component: HistoryComponent },
  { path: 'BillingInfo', component: BillingInfoComponent },
  { path: 'Password', component: PasswordComponent },
  { path: 'ViewBill/:billId', component: ViewBillComponent },
];

@NgModule({
  declarations: [
    UserInfoComponent,
    AddressComponent,
    HistoryComponent,
    PasswordComponent,
    BillingInfoComponent,
    ViewBillComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class UserInfoModule {}
