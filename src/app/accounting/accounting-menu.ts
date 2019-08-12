import {BalancesMenuItem} from './balance/balance-menu';
import {AccountsMenuitem} from './account/account-menu';

export const AccountingEntriesMenuItem = {
  label: 'Entries',
  title: 'Accounting entries',
  icon: 'fa fa-list',
  routerLink: ['/accounting/entry']
};
export const AccountingEntriesListItem = {
  label: 'List',
  title: 'Accounting entries',
  icon: 'fa fa-list',
  routerLink: ['/accounting/entry/list']
};

export const AccountingMenuItems = [
  AccountingEntriesMenuItem,
  BalancesMenuItem,
  AccountsMenuitem
];
