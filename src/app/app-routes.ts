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
    path: 'me',
    data: createAppRouteData(AppMenu.me),
    children: LoggedUserRoutes
  },
  {
    path: 'comptoir',
    loadChildren: './comptoir/comptoir.module#ComptoirModule',
    data: createAppRouteData(AppMenu.comptoir)
  },
  {
    path: 'sale',
    loadChildren: './sale/sale.module#SaleModule',
    data: createAppRouteData(AppMenu.sale)
  },
  {
    path: 'pos',
    loadChildren: './pos/pos.module#PosModule',
    data: createAppRouteData(AppMenu.pos)
  },
  {
    path: 'item',
    loadChildren: './item/item.module#ItemModule',
    data: createAppRouteData(AppMenu.item)

  },
  {
    path: 'balance',
    loadChildren: './balance/balance.module#BalanceModule',
    data: createAppRouteData(AppMenu.balance)

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
    path: 'stock',
    loadChildren: './stock/stock.module#StockModule',
    data: createAppRouteData(AppMenu.stock)
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule',
    data: createAppRouteData(AppMenu.account)
  },
];
