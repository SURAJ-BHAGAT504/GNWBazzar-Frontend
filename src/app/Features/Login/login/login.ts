import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../Core/Services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin() {
    if (this.loginForm.valid) {
      const loginPayload = {
        Email: this.loginForm.value.email,
        Password: this.loginForm.value.password
      };

      this.authService.login(loginPayload).subscribe({
        next: (res: any) => {
          const status = res.responseCode || res.ResponseCode;
          const msg = res.message || res.Message;

          if (status === 200) {
            console.log('Login successful! Redirecting...');
            this.router.navigate(['dashboard']);
          } else {
            alert(msg);
          }
        },
        error: (err) => {
          console.error('Submission error:', err);
        }
      });
    }
  }
}
