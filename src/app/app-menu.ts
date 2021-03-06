import {MenuItem} from 'primeng/api';
import {SaleMenuItems} from './sale/sale-menu';
import {PosMenuItems} from './pos/pos-menu';
import {ItemMenuItems} from './item/item-menu';
import {CustomerMenuItems} from './customer/customer-menu';
import {EmployeeMenuItems} from './employee/employee-menu';
import {InvoiceMenuItems} from './invoice/invoice-menu';
import {StockMenuItems} from './stock/stock-menu';
import {FunctionsUtils} from './util/functions-utils';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {RouteUtils} from './util/route-utils';
import {ResolvedRouteItem} from './util/resolved-route-item';
import {ComptoirMenuItems} from './comptoir/comptoir-menu';
import {CompanyMenuItems} from './company/company-menu';
import {AccountingMenuItems} from './accounting/accounting-menu';

const UserMenuItems: (MenuItem | ResolvedRouteItem<any>)[] = [
  {
    icon: 'fa fa-user',
    routerLink: ['/me/profile'],
    label: 'Profile',
    title: 'Profile'
  },
  {
    icon: 'fa fa-building',
    routerLink: ['/me/company'],
    label: 'Company',
    title: 'Company'
  },
  {
    icon: 'fa fa-sign-out',
    routerLink: ['/logout', {logoff: true}],
    label: 'Logoff',
    title: 'Logoff',
  }
];

export const AppMenu: { [key: string]: MenuItem | ResolvedRouteItem<any> } = {
  home: {
    icon: 'fa fa-home',
    label: 'Home',
    title: 'Home',
    routerLink: ['/'],
  },
  accounting: {
    label: 'Accounting',
    title: 'Accounting',
    icon: 'fa fa-calculator',
    routerLink: ['/accounting'],
    items: AccountingMenuItems,
  },
  comptoir: {
    label: 'Comptoir',
    title: 'Comptoir',
    icon: 'fa fa-shopping-basket',
    routerLink: ['/comptoir'],
    items: ComptoirMenuItems
  },
  company: {
    label: 'Company',
    title: 'Company',
    icon: 'fa fa-building',
    items: CompanyMenuItems
  },
  customer: {
    label: 'Customer',
    title: 'Customer',
    icon: 'fa fa-user-o',
    routerLink: ['/customer'],
    items: CustomerMenuItems,
  },
  employee: {
    label: 'Employee',
    title: 'Employee',
    icon: 'fa fa-user-o',
    routerLink: ['/employee'],
    items: EmployeeMenuItems,
  },
  invoice: {
    label: 'Invoice',
    title: 'Invoice',
    icon: 'fa fa-user-o',
    routerLink: ['/invoice'],
    items: InvoiceMenuItems,
  },


  item: {
    label: 'Items',
    title: 'Items',
    icon: 'fa fa-square',
    routerLink: ['/item'],
    items: ItemMenuItems
  },

  pos: {
    label: 'Points of sale',
    title: 'Points of sale',
    icon: 'fa fa-building',
    routerLink: ['/pos'],
    items: PosMenuItems
  },
  sale: {
    label: 'Sales',
    title: 'Sales',
    icon: 'fa fa-shopping-cart',
    routerLink: ['/sale'],
    items: SaleMenuItems
  },

  stock: {
    label: 'Stock',
    title: 'Stock',
    icon: 'fa fa-user-o',
    routerLink: ['/stock'],
    items: StockMenuItems,
  },


  me: {
    icon: 'fa fa-user',
    routerLink: ['/me'],
    labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsEmployee>(
      FunctionsUtils.splitDomainObjectCallback<WsEmployee, string>(
        employee => `${employee.firstName} ${employee.lastName}`
      ), 'loggedEmployee',
    ),
    items: UserMenuItems
  },
};
