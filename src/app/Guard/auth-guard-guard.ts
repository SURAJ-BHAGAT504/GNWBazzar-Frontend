import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token'); 

    if (token) {
      return true;
    } else {
      console.warn('No token found, redirecting to login...');
      router.navigate(['/login']);
      return false;
    }
  } 

  return true; 
};