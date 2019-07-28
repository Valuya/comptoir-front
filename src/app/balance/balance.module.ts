import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BalanceRoutingModule} from './balance-routing.module';
import {BalanceListRouteComponent} from './balance-list-route/balance-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {BalanceColumnComponent} from './balance-column/balance-column.component';
import {BalanceDetailsRouteComponent} from './balance-details-route/balance-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {BalanceFormComponent} from './balance-form/balance-form.component';
import {FormsModule} from '@angular/forms';
import {CalendarModule, InputSwitchModule, InputTextareaModule, InputTextModule, SpinnerModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {AccountSelectModule} from '../domain/accounting/account-select/account-select.module';
import {AccountComponentModule} from '../domain/accounting/account/account.module';
import {DateSelectModule} from '../domain/util/date-select/date-select.module';


@NgModule({
  declarations: [BalanceListRouteComponent, BalanceColumnComponent, BalanceDetailsRouteComponent, BalanceFormComponent],
  imports: [
    CommonModule,
    BalanceRoutingModule,
    ShellContentPageModule,
    ShellTableModule,
    ShellDetailsFormModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    ShellInplaceEditModule,
    AccountComponentModule,
    AccountSelectModule,
    InputTextareaModule,
    CalendarModule,
    SpinnerModule,
    DateSelectModule,
  ]
})
export class BalanceModule {
}
