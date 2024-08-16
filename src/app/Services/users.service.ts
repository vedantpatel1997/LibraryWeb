import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from 'src/app/DTO/APIResponse';
import { environment } from 'src/app/environments/environment';
import { User } from '../DTO/User';
import { Address } from '../DTO/Address';
import { UpdatePassword } from '../DTO/UpdatePassword';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userApiUrl = environment.apiAddress + 'Users/';

  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.userApiUrl + 'GetAllUsers');
  }

  getUserByUserId(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.userApiUrl + `GetById?id=${userId}`);
  }

  createUser(userData: User): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.userApiUrl}Create`, userData);
  }

  updateUser(userData: User, userId: number): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.userApiUrl}Update?id=${userId}`,
      userData
    );
  }

  createAddress(addressData: Address, userId: number): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.userApiUrl}CreateAddress?userId=${userId}`,
      addressData
    );
  }

  GetAddressByUserId(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.userApiUrl}GetAddressByUserId?userId=${userId}`
    );
  }

  updateAddress(addressData: Address, userId: number): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.userApiUrl}UpdateAddress?userId=${userId}`,
      addressData
    );
  }

  updatePassword(password: UpdatePassword): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.userApiUrl}UpdatePassword`,
      password
    );
  }

  SendUserInfo(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.userApiUrl}SendInfo?userId=${userId}`
    );
  }

  SendResetPassword(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.userApiUrl}SendResetPassword?userId=${userId}`
    );
  }

  DeleteUser(userId: number): Observable<APIResponse> {
    return this.http.delete<APIResponse>(
      `${this.userApiUrl}Delete?id=${userId}`
    );
  }

  MakeAdmin(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.userApiUrl}MakeAdmin?userId=${userId}`
    );
  }
  MakeUser(userId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.userApiUrl}MakeUser?userId=${userId}`
    );
  }
}
