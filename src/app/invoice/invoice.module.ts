import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InvoiceRoutingModule} from './invoice-routing.module';
import {InvoiceListRouteComponent} from './invoice-list-route/invoice-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import { InvoiceColumnComponent } from './invoice-column/invoice-column.component';
import { InvoiceDetailsRouteComponent } from './invoice-details-route/invoice-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InputSwitchModule, InputTextModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';


@NgModule({
  declarations: [InvoiceListRouteComponent, InvoiceColumnComponent, InvoiceDetailsRouteComponent, InvoiceFormComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
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
export class InvoiceModule {
}
