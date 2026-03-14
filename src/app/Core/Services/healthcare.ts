import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Healthcare {
  private http = inject(HttpClient);
  private baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com';

  // --- DOCTOR METHODS ---
  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll_Doctor`);
  }
  // This sends multipart/form-data to match your IFormFile backend requirements
  createDoctor(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create_Doctor`, formData);
  }

  // --- CATEGORY MASTER METHODS ---
  getCategoryMasters(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll_CategoryMaster`);
  }
  createCategoryMaster(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create_CategoryMaster`, data);
  }

  // --- HEALTHCARE CATEGORY METHODS ---
  getHealthCareCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll_HealthCare_Category`);
  }
  createHealthCareCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create_HealthCare_Category`, data);
  }
}