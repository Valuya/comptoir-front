import {Route} from '@angular/router';
import {AppMenu} from './app-menu';
import {createAppRouteData} from './util/app-route-data';

export const APP_SHELL_ROUTE_DATA_ID = 'app-shell-route';

export const APP_MODULES_ROUTES: Route[] = [
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
];
