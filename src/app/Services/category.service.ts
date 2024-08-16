import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../DTO/APIResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryApiUrl = environment.apiAddress + 'Category/';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.categoryApiUrl + 'GetAllCategories');
  }
}
