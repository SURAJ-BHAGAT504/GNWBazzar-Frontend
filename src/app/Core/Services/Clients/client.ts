import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Client {
  private http = inject(HttpClient);
  private baseUrl = 'https://gnwbazaar-002-site2.qtempurl.com';

  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll_Client`);
  }

  createClient(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create_Client`, formData);
  }

  updateClient(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update_Client`, formData);
  }
}
