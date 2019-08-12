import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingEntryListRouteComponent } from './accounting-entry-list-route/accounting-entry-list-route.component';
import { AccountingEntryColumnComponent } from './accounting-entry-column/accounting-entry-column.component';
import {AccountComponentModule} from '../domain/accounting/account/account.module';
import {CustomerModule} from '../domain/thirdparty/customer/customer.module';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import { AccountingEntryFilterComponent } from './accounting-entry-filter/accounting-entry-filter.component';
import {CustomerSelectModule} from '../domain/thirdparty/customer-select/customer-select.module';
import {AccountSelectModule} from '../domain/accounting/account-select/account-select.module';
import {AccountTypeSelectModule} from '../domain/accounting/account-type-select/account-type-select.module';
import {FormsModule} from '@angular/forms';
import {TriStateCheckboxModule} from 'primeng/primeng';
import {DateRangeSelectModule} from '../domain/util/date-range-select/date-range-select.module';


@NgModule({
  declarations: [AccountingEntryListRouteComponent, AccountingEntryColumnComponent, AccountingEntryFilterComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    AccountComponentModule,
    CustomerModule,
    LocaleTextModule,
    ShellContentPageModule,
    ShellTableModule,
    CustomerSelectModule,
    AccountSelectModule,
    AccountTypeSelectModule,
    FormsModule,
    TriStateCheckboxModule,
    DateRangeSelectModule
  ]
})
export class AccountingModule { }
