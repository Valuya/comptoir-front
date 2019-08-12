import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {AccountListRouteComponent} from './account-list-route/account-list-route.component';
import {ShellContentPageModule} from '../../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../../app-shell/shell-table/shell-table.module';
import {AccountColumnComponent} from './account-column/account-column.component';
import {AccountDetailsRouteComponent} from './account-details-route/account-details-route.component';
import {ShellDetailsFormModule} from '../../app-shell/shell-details-form/shell-details-form.module';
import {AccountFormComponent} from './account-form/account-form.component';
import {FormsModule} from '@angular/forms';
import {CalendarModule, InputSwitchModule, InputTextareaModule, InputTextModule, SpinnerModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {AccountSelectModule} from '../../domain/accounting/account-select/account-select.module';
import {AccountComponentModule} from '../../domain/accounting/account/account.module';
import {DateSelectModule} from '../../domain/util/date-select/date-select.module';
import {AccountTypeModule} from '../../domain/accounting/account-type/account-type.module';
import {LocaleTextModule} from '../../domain/lang/locale-text/locale-text.module';
import {AccountTypeSelectModule} from '../../domain/accounting/account-type-select/account-type-select.module';
import {LocaleTextEditModule} from '../../domain/lang/locale-text-edit/locale-text-edit.module';


@NgModule({
  declarations: [AccountListRouteComponent, AccountColumnComponent, AccountDetailsRouteComponent, AccountFormComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
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
    AccountTypeModule,
    LocaleTextModule,
    AccountTypeSelectModule,
    LocaleTextEditModule,
  ]
})
export class AccountModule {
}
