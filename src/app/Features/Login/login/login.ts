import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../Core/Services/Auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  isSubmitting = false;

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
      this.isSubmitting = true; 

      const loginPayload = {
        Email: this.loginForm.value.email,
        Password: this.loginForm.value.password
      };

      this.authService.login(loginPayload).subscribe({
        next: (res: any) => {
          this.isSubmitting = false; 
          const status = res.responseCode || res.ResponseCode;
          const msg = res.message || res.Message;

          if (status === 200) {
            this.router.navigate(['dashboard']);
          } else {
            alert(msg);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Submission error:', err);
        }
      });
    }
  }
}
