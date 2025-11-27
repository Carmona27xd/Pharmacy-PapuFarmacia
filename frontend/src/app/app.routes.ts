import { Routes } from '@angular/router';

import { GuardAuth } from './guards/auth-guard';

import { PageLogin } from './pages/auth/login/login';
import { PageRegistration } from './pages/auth/registration/registration';
import { PageNotFound } from './pages/errors/not-found/not-found';
import { PageHome } from './pages/home/home';
import { PageRegisterProduct } from './pages/products/register/register-product';
import { PageDetailsProduct } from './pages/products/details/details-product';
import { PageSearchForProducts } from './pages/products/search-for/search-for';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    component: PageHome,
  },
  // Users
  {
    path: 'login',
    component: PageLogin,
  },
  {
    path: 'registro-usuario',
    component: PageRegistration,
  },
  // Products
  {
    path: 'registro-producto',
    canActivate: [GuardAuth],
    component: PageRegisterProduct,
  },
  {
    path: 'detalles-producto',
    component: PageDetailsProduct,
  },
  { path: 'buscar-producto', component: PageSearchForProducts },
  { path: '**', component: PageNotFound },
];
