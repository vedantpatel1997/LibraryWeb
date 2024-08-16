import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIResponse } from '../DTO/APIResponse';
import { userCred } from '../DTO/userCred';
import { Router } from '@angular/router';
import { APIToken } from '../DTO/APIToken';
import { User } from '../DTO/User';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private curUserdata: User | undefined;
  private token: string | undefined;
  private refreshToken: string | undefined;
  private bookApiUrl = environment.apiAddress + 'Authorize/';
  private secretKey = environment.secret;

  // Behaviour subject to pass data in the app component.ts or any other component directly
  private loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  // call this behavoiur and every subscribers of this will notice a change
  get isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  constructor(private http: HttpClient, private route: Router) {}

  setData(APIResponse: APIResponse) {
    this.curUserdata = APIResponse.data.userData;
    this.token = APIResponse.data.token;
    this.refreshToken = APIResponse.data.refreshToken;

    // Storing tokens in the localstorage
    localStorage.setItem('token', APIResponse.data.token);
    localStorage.setItem('refreshToken', APIResponse.data.refreshToken);
    // localStorage.setItem(
    //   'curUserData',
    //   JSON.stringify(APIResponse.data.userData)
    // );
    localStorage.setItem(
      'curUserData',
      this.encryptData(APIResponse.data.userData)
    );
  }
  getUserData() {
    return (
      // this.curUserdata ||
      // (JSON.parse(localStorage.getItem('curUserData')) as User)
      this.curUserdata || this.decryptData(localStorage.getItem('curUserData'))
    );
  }
  getTokenValue() {
    return this.token || localStorage.getItem('token') || '';
  }
  getRefreshTokenValue() {
    return this.refreshToken || localStorage.getItem('refreshToken') || '';
  }
  generateToken(usercred: userCred): Observable<APIResponse> {
    // Prepare the request body with the user credentials
    const requestBody = {
      username: usercred.username,
      password: usercred.password,
    };

    // Make the POST request to the API endpoint with the request body
    return this.http.post<APIResponse>(
      this.bookApiUrl + 'GenerateToken',
      requestBody
    );
  }
  generateRefreshToken(): Observable<APIResponse> {
    const requestBody = {
      token: this.getTokenValue(),
      refreshToken: this.getRefreshTokenValue(),
    };
    return this.http.post<APIResponse>(
      this.bookApiUrl + 'GenerateRefreshToken',
      requestBody
    );
  }
  login() {
    this.loggedInSubject.next(true);
  }
  logout() {
    this.removeloggedinData();
    this.loggedInSubject.next(false);
    this.route.navigateByUrl('');
  }
  removeloggedinData() {
    // Order of this lines is matter alot, dont changed it blindly
    this.curUserdata = undefined;
    this.token = undefined;
    this.refreshToken = undefined;

    // Removing tokens from localstorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('curUserData');
  }
  haveAccess(role: string) {
    try {
      if (this.token === '') {
        // If the token is empty or not found, return false (no access)
        return false;
      }

      // Attempt to split the token and decode the middle part (payload)
      const tokenParts = this.token.split('.');
      if (tokenParts.length !== 3) {
        // If the token doesn't have the expected three parts, it's invalid
        return false;
      }

      // Decode the middle part of the token (payload)
      const atobData = atob(tokenParts[1]);
      const finalData = JSON.parse(atobData);

      // Check if the role in the token matches the specified role
      if (
        finalData &&
        finalData.role &&
        finalData.role.trim() === role &&
        finalData.UserId == this.curUserdata.userId
      ) {
        return true; // Role matches, access granted
      }
    } catch (error) {
      // Handle any potential errors, such as invalid token format or JSON parsing errors
      console.error('Error while checking access:');
      this.logout();
      return false;
    }

    // If any error occurred or access was not granted, return false
    return false;
  }

  private encryptData(data: any) {
    const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
    const options = { iv: iv, mode: CryptoJS.mode.CFB }; // Customize the mode as needed
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey,
      options
    ).toString();
  }

  private decryptData(encryptedData: any): User | null {
    try {
      const options = { mode: CryptoJS.mode.CFB }; // Use the same mode as during encryption
      const decryptedText = CryptoJS.AES.decrypt(
        encryptedData,
        this.secretKey,
        options
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText) as User;
    } catch (error) {
      return null;
    }
  }
}
