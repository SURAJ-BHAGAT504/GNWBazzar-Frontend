import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Auth } from '../../../Core/Services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  authService = inject(Auth);
  router = inject(Router);

  isSidebarOpen = false;
  isHealthCareOpen = false;
  isUserMenuOpen = false;

  userName = '';
  userEmail = '';

  constructor(private eRef: ElementRef) {}

  ngOnInit() {

    const storedUser = localStorage.getItem('user');
    this.userName =
      storedUser && storedUser !== '{}' && storedUser !== 'undefined'
        ? storedUser
        : 'Guest';

    const storedEmail = localStorage.getItem('EMAIL');
    this.userEmail =
      storedEmail && storedEmail !== 'undefined'
        ? storedEmail
        : 'No Email Found';
  }

  get isMainDashboard(): boolean {
    return this.router.url === '/dashboard';
  }

  toggleHealthCare() {
    this.isHealthCareOpen = !this.isHealthCareOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    } else {
      const clickedInside = event.target.closest('.user-profile-wrapper');
      if (!clickedInside) {
        this.isUserMenuOpen = false;
      }
    }
  }

  onLogout() {
    this.authService.logout();
  }
}