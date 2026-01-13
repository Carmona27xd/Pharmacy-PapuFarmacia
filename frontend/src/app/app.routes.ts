import { Routes } from '@angular/router';

import { GuardAuth } from './guards/auth-guard';

import { PageNotFound } from './pages/errors/not-found/not-found';
import { PageLogin } from './pages/auth/login/login';
import { PageRegistration } from './pages/auth/registration/registration';
import { PageHome } from './pages/home/home';
import { PageRegisterProduct } from './pages/products/register/register-product';
import { PageDetailsProduct } from './pages/products/details/details-product';
import { PageSearchForProducts } from './pages/products/search-for/search-for';
import { SuppliersListComponent } from './pages/suppliers/supplier-list.component'
import { NewSupplierComponent } from './pages/suppliers/new-supplier/new-supplier.component';
import { CreateOrderComponent } from './pages/suppliers/new-purchase-order/new-purchase-order.component';
import { OrdersListComponent } from './pages/orders-list/orders-list';
import { EditSupplierComponent } from './pages/suppliers/edit-supplier/edit-supplier';

import { ViewMyProfile } from './pages/users/view-my-profile/view-my-profile/view-my-profile';
import { AdminPage } from './pages/admin/home/home';

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
  {
    path: 'suppliers', 
    component: SuppliersListComponent
  },
  {
    path: 'suppliers/create',
    component: NewSupplierComponent
  },
  {
    path: 'orders/create/:licence',
    component: CreateOrderComponent
  },
  { path: 'orders', 
    component: OrdersListComponent 
  }, 
  { path: 'suppliers/edit/:licence', 
    component: EditSupplierComponent 
    //admin feed
  },
  {
    path: 'admin/home',
    component: AdminPage
  },
  { path: '**', component: PageNotFound },

];
