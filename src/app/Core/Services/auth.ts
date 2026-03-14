import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_BASE = 'https://gnwbazaar-002-site2.qtempurl.com';

  login(credentials: any): Observable<any> {
  const formData = new FormData();
  formData.append('Email', credentials.Email);
  formData.append('Password', credentials.Password);

  return this.http.post(`${this.API_BASE}/GNW_Login`, formData).pipe(
    map((response: any) => {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      const code = data.responseCode || data.ResponseCode;
      const val = data.value || data.Value;

      if (code === 200 && val) {
        localStorage.setItem('token', val.accessToken);
        localStorage.setItem('refreshToken', val.token || val.Token);
        localStorage.setItem('user', val.name || val.Name || 'User');
        localStorage.setItem('role', val.UserRole || val.userRole || 'User');
        localStorage.setItem('Id', val.id || val.Id);
        localStorage.setItem('EMAIL', val.email || val.Email);
      }
      return data; 
    })
  );
}

  logout() {
    return this.http.post(`${this.API_BASE}/GNW_Logout`, {}).subscribe({
      next: () => this.clearLocalStorage(),
      error: () => this.clearLocalStorage()
    });
  }

  private clearLocalStorage() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}