import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../Core/Services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private route: ActivatedRoute) { }

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginErrorMessage = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.loginErrorMessage = params['message'];
      }
    });
  }

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
