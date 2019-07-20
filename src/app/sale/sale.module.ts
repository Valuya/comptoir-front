import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SaleRoutingModule} from './sale-routing.module';
import {SaleListRouteComponent} from './sale-list-route/sale-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {SaleColumnComponent} from './sale-column/sale-column.component';
import {SaleDetailsRouteComponent} from './sale-details-route/sale-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {SaleFormComponent} from './sale-form/sale-form.component';
import {FormsModule} from '@angular/forms';
import {CalendarModule, InputSwitchModule, InputTextModule, TriStateCheckboxModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {SaleFilterComponent} from './sale-filter/sale-filter.component';
import {CustomerSelectModule} from '../domain/thirdparty/customer-select/customer-select.module';
import {CustomerModule} from '../domain/thirdparty/customer/customer.module';
import {DateSelectModule} from '../domain/util/date-select/date-select.module';


@NgModule({
  declarations: [SaleListRouteComponent, SaleColumnComponent, SaleDetailsRouteComponent, SaleFormComponent, SaleFilterComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    ShellContentPageModule,
    ShellTableModule,
    ShellDetailsFormModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    ShellInplaceEditModule,
    CustomerSelectModule,
    CalendarModule,
    CustomerModule,
    TriStateCheckboxModule,
    CustomerModule,
    DateSelectModule,
  ]
})
export class SaleModule {
}
