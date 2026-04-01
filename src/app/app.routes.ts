import { Routes } from '@angular/router';
import { Login } from './Features/Login/login/login';
import { Dashboard } from './Features/Dashboard/dashboard/dashboard';
import { authGuardGuard } from './Guard/auth-guard-guard';
import { Doctor } from './Features/HealthCare/Doctor/doctor/doctor';
import { Categorymaster } from './Features/HealthCare/CategoryMaster/categorymaster/categorymaster';
import { Healthcarecategory } from './Features/HealthCare/HealthCareCategory/healthcarecategory/healthcarecategory';
import { Sponsor } from './Features/Sponsor/sponsor/sponsor';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {path: 'doctor', component: Doctor},
      {path: 'categorymaster', component: Categorymaster},
      {path: 'healthcarecategory', component: Healthcarecategory},
      {path: 'sponsor', component: Sponsor}
    ],
    canActivate: [authGuardGuard]
  }
];
