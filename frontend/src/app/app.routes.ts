import { Routes } from '@angular/router';

import { GuardAuth } from './guards/auth-guard';

import { PageNotFound } from './pages/errors/not-found/not-found';
import { PageLogin } from './pages/auth/login/login';
import { PageRegistration } from './pages/auth/registration/registration';
import { PageHome } from './pages/home/home';
import { PageRegisterProduct } from './pages/products/register/register-product';
import { PageDetailsProduct } from './pages/products/details/details-product';
import { PageSearchForProducts } from './pages/products/search-for/search-for';
import { ViewMyProfile } from './pages/users/view-my-profile/view-my-profile/view-my-profile';
import { PageAdminHome } from './pages/admin/home/home/home';

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
  // Auth
  {
    path: 'login',
    component: PageLogin,
  },
  {
    path: 'usuario/registro',
    component: PageRegistration,
  },
  // Admin
  {
    path: 'admin/home',
    // TODO canActivate: [GuardAuth],
    component: PageAdminHome,
  },
  // Users
  {
    path: 'usuario/perfil',
    // TODO canActivate: [GuardAuth],
    component: ViewMyProfile,
  },
  // Products
  {
    path: 'productos/buscar/:query',
    component: PageSearchForProducts,
  },
  {
    path: 'productos/registro',
    // TODO canActivate: [GuardAuth],
    component: PageRegisterProduct,
  },
  {
    path: 'productos/detalles/:productId',
    component: PageDetailsProduct,
  },
  { path: '**', component: PageNotFound },
];
