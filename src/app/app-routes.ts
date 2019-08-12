import {Route} from '@angular/router';
import {AppMenu} from './app-menu';
import {createAppRouteData} from './util/app-route-data';
import {DashboardRouteComponent} from './app-shell/dashboard-route/dashboard-route.component';

const LoggedUserRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/employee/me'
  },
  {
    path: 'profile',
    redirectTo: '/employee/me'
  },
  {
    path: 'company',
    redirectTo: '/company/mine/details'
  }
];
export const APP_MODULES_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardRouteComponent,
    data: createAppRouteData(AppMenu.home),
  },
  {
    path: 'accounting',
    loadChildren: './accounting/accounting.module#AccountingModule',
    data: createAppRouteData(AppMenu.accounting)
  },
  {
    path: 'company',
    loadChildren: './company/company.module#CompanyModule',
    data: createAppRouteData(AppMenu.company)
  },
  {
    path: 'comptoir',
    loadChildren: './comptoir/comptoir.module#ComptoirModule',
    data: createAppRouteData(AppMenu.comptoir)
  },

  {
    path: 'customer',
    loadChildren: './customer/customer.module#CustomerModule',
    data: createAppRouteData(AppMenu.customer)

  },
  {
    path: 'employee',
    loadChildren: './employee/employee.module#EmployeeModule',
    data: createAppRouteData(AppMenu.employee)

  },
  {
    path: 'invoice',
    loadChildren: './invoice/invoice.module#InvoiceModule',
    data: createAppRouteData(AppMenu.invoice)

  },
  {
    path: 'item',
    loadChildren: './item/item.module#ItemModule',
    data: createAppRouteData(AppMenu.item)

  },
  {
    path: 'me',
    data: createAppRouteData(AppMenu.me),
    children: LoggedUserRoutes
  },
  {
    path: 'pos',
    loadChildren: './pos/pos.module#PosModule',
    data: createAppRouteData(AppMenu.pos)
  },
  {
    path: 'sale',
    loadChildren: './sale/sale.module#SaleModule',
    data: createAppRouteData(AppMenu.sale)
  },
  {
    path: 'stock',
    loadChildren: './stock/stock.module#StockModule',
    data: createAppRouteData(AppMenu.stock)
  },
];
