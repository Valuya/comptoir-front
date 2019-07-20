import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PosRoutingModule} from './pos-routing.module';
import {PosColumnComponent} from './pos-column/pos-column.component';
import {PosFormComponent} from './pos-form/pos-form.component';
import {PosDetailsRouteComponent} from './pos-details-route/pos-details-route.component';
import {PosListRouteComponent} from './pos-list-route/pos-list-route.component';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ButtonModule} from 'primeng/button';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {FormsModule} from '@angular/forms';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {CustomerModule} from '../domain/thirdparty/customer/customer.module';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {CustomerSelectModule} from '../domain/thirdparty/customer-select/customer-select.module';


@NgModule({
  declarations: [PosColumnComponent, PosFormComponent, PosDetailsRouteComponent, PosListRouteComponent],
  imports: [
    CommonModule,
    PosRoutingModule,
    ShellInplaceEditModule,
    ShellContentPageModule,
    ButtonModule,
    ShellTableModule,
    FormsModule,
    ShellDetailsFormModule,
    CustomerModule,
    LocaleTextModule,
    LocaleTextEditModule,
    CustomerSelectModule
  ]
})
export class PosModule {
}
