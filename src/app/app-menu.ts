import {MenuItem} from 'primeng/api';
import {SaleMenuItems} from './sale/sale-menu';
import {PosMenuItems} from './pos/pos-menu';
import {ItemMenuItems} from './item/item-menu';
import {BalanceMenuItems} from './balance/balance-menu';
import {CustomerMenuItems} from './customer/customer-menu';
import {EmployeeMenuItems} from './employee/employee-menu';
import {InvoiceMenuItems} from './invoice/invoice-menu';
import {StockMenuItems} from './stock/stock-menu';

export const LOGGED_USER_MENU_ID = 'logged-user';

export const AppMenu: { [key: string]: MenuItem } = {
  me: {
    icon: 'fa fa-user',
    routerLink: ['/me'],
    id: LOGGED_USER_MENU_ID,
  },
  sale: {
    label: 'Sales',
    title: 'Sales',
    icon: 'fa fa-shopping-cart',
    routerLink: ['/sale'],
    expanded: false,
    items: SaleMenuItems
  },
  pos: {
    label: 'Points of sale',
    title: 'Points of sale',
    icon: 'fa fa-building',
    routerLink: ['/pos'],
    expanded: false,
    items: PosMenuItems
  },
  item: {
    label: 'Items',
    title: 'Items',
    icon: 'fa fa-square',
    routerLink: ['/item'],
    expanded: false,
    items: ItemMenuItems
  },
  balance: {
    label: 'Balance',
    title: 'Balance',
    icon: 'fa fa-balance-scale',
    routerLink: ['/balance'],
    items: BalanceMenuItems,
    expanded: false,
  },
  customer: {
    label: 'Customer',
    title: 'Customer',
    icon: 'fa fa-user-o',
    routerLink: ['/customer'],
    items: CustomerMenuItems,
    expanded: false,
  },
  employee: {
    label: 'Employee',
    title: 'Employee',
    icon: 'fa fa-user-o',
    routerLink: ['/employee'],
    items: EmployeeMenuItems,
    expanded: false,
  },
  invoice: {
    label: 'Invoice',
    title: 'Invoice',
    icon: 'fa fa-user-o',
    routerLink: ['/invoice'],
    items: InvoiceMenuItems,
    expanded: false,
  },
  stock: {
    label: 'Stock',
    title: 'Stock',
    icon: 'fa fa-user-o',
    routerLink: ['/stock'],
    items: StockMenuItems,
    expanded: false,
  },
};
