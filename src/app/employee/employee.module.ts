import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeeRoutingModule} from './employee-routing.module';
import {EmployeeListRouteComponent} from './employee-list-route/employee-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {EmployeeColumnComponent} from './employee-column/employee-column.component';
import {EmployeeDetailsRouteComponent} from './employee-details-route/employee-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {EmployeeFormComponent} from './employee-form/employee-form.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InputSwitchModule, InputTextModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {AppShellModule} from '../app-shell/app-shell.module';
import {LocaleSelectModule} from '../domain/lang/locale-select/locale-select.module';
import {LocaleModule} from '../domain/lang/locale/locale.module';


@NgModule({
  declarations: [EmployeeListRouteComponent, EmployeeColumnComponent, EmployeeDetailsRouteComponent, EmployeeFormComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ShellContentPageModule,
    ShellTableModule,
    ShellDetailsFormModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    ShellInplaceEditModule,
    ButtonModule,
    AppShellModule,
    LocaleSelectModule,
    LocaleModule,
  ]
})
export class EmployeeModule {
}
