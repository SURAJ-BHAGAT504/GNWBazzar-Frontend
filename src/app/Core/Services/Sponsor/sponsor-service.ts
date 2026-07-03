import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  private http = inject(HttpClient);
  private baseUrl = 'https://gnwbazaar.in/apigateway';

  getSponsors() {
    return this.http.get(`${this.baseUrl}/GetByAdmin_Sponsor`);
  }

  createSponsor(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create_Sponsor`, formData);
  }

  updateSponsor(formData: FormData): Observable<any> {
      return this.http.put(`${this.baseUrl}/Update_Sponsor`, formData);
    }
}
