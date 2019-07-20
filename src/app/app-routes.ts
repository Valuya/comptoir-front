import {MenuItem} from 'primeng/api';
import {Route} from '@angular/router';
import {POS_ROUTES} from './pos/pos-routing.module';
import {ITEM_ROUTES} from './item/item-routing.module';
import {SALE_ROUTES} from './sale/sale-routing.module';
import {BALANCE_ROUTES} from './balance/balance-routing.module';
import {EMPLOYEE_ROUTES} from './employee/employee-routing.module';
import {CUSTOMER_ROUTES} from './customer/customer-routing.module';
import {INVOICE_ROUTES} from './invoice/invoice-routing.module';
import {STOCK_ROUTES} from './stock/stock-routing.module';

export const APP_SHELL_ROUTE_DATA_ID = 'app-shell-route';

export interface AppRouteData {
  menuItem?: MenuItem;
}

export const APP_MODULES_ROUTES: Route[] = [
  {
    path: 'sale',
    loadChildren: './sale/sale.module#SaleModule',
    data: {
      menuItem: {
        label: 'Sales',
        title: 'Sales',
        icon: 'fa fa-shopping-cart',
        routerLink: ['/sale'],
        items: SALE_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'pos',
    loadChildren: './pos/pos.module#PosModule',
    data: {
      menuItem: {
        label: 'Points of sale',
        title: 'Points of sale',
        icon: 'fa fa-building',
        routerLink: ['/pos'],
        items: POS_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'item',
    loadChildren: './item/item.module#ItemModule',
    data: {
      menuItem: {
        label: 'Items',
        title: 'Items',
        icon: 'fa fa-square',
        routerLink: ['/item'],
        items: ITEM_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'balance',
    loadChildren: './balance/balance.module#BalanceModule',
    data: {
      menuItem: {
        label: 'Balance',
        title: 'Balance',
        icon: 'fa fa-balance-scale',
        routerLink: ['/balance'],
        items: BALANCE_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'customer',
    loadChildren: './customer/customer.module#CustomerModule',
    data: {
      menuItem: {
        label: 'Customer',
        title: 'Customer',
        icon: 'fa fa-user-o',
        routerLink: ['/customer'],
        items: CUSTOMER_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'employee',
    loadChildren: './employee/employee.module#EmployeeModule',
    data: {
      menuItem: {
        label: 'Employee',
        title: 'Employee',
        icon: 'fa fa-user-md',
        routerLink: ['/employee'],
        items: EMPLOYEE_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'invoice',
    loadChildren: './invoice/invoice.module#InvoiceModule',
    data: {
      menuItem: {
        label: 'Invoice',
        title: 'Invoice',
        icon: 'fa fa-file-text',
        routerLink: ['/invoice'],
        items: INVOICE_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
  {
    path: 'stock',
    loadChildren: './stock/stock.module#StockModule',
    data: {
      menuItem: {
        label: 'Stock',
        title: 'Stock',
        icon: 'fa fa-hand-spock-o',
        routerLink: ['/stock'],
        items: STOCK_ROUTES.map(route => route.data as AppRouteData)
          .filter(data => data != null)
          .map(data => data.menuItem)
          .filter(item => item.routerLink != null)
          .filter(item => item != null),
        expanded: false,
      } as MenuItem
    } as AppRouteData
  },
];
