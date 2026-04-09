import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Subcategorymaster {
  private http = inject(HttpClient);
  private baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com';

  getSubCategoryMaster(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll_SubCategoryMaster`);
  }

  createSubCategoryMaster(data: any): Observable<any> {  
    return this.http.post(`${this.baseUrl}/Create_SubCategoryMaster`, data);
  }

  updateSubCategoryMaster(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update_SubCategoryMaster`, data);
  }
}
