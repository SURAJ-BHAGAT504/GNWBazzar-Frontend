import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && (role === 'Admin' || role === 'admin')) {
      return true;
    }

    localStorage.clear();
    router.navigate(['/login'], {
      queryParams: { message: 'Access denied. Admin only.' }
    });

    return false;
  }

  return true;
};