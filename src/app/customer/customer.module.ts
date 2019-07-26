import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerListRouteComponent} from './customer-list-route/customer-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {CustomerColumnComponent} from './customer-column/customer-column.component';
import {CustomerDetailsRouteComponent} from './customer-details-route/customer-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {CustomerFormComponent} from './customer-form/customer-form.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InputSwitchModule, InputTextModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';


@NgModule({
  declarations: [CustomerListRouteComponent, CustomerColumnComponent, CustomerDetailsRouteComponent, CustomerFormComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ShellContentPageModule,
    ShellTableModule,
    ShellDetailsFormModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    ShellInplaceEditModule,
    ButtonModule,
  ]
})
export class CustomerModule {
}
