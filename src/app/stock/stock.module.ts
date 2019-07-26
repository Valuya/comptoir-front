import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StockRoutingModule} from './stock-routing.module';
import {StockListRouteComponent} from './stock-list-route/stock-list-route.component';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {StockColumnComponent} from './stock-column/stock-column.component';
import {StockDetailsRouteComponent} from './stock-details-route/stock-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {StockFormComponent} from './stock-form/stock-form.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InputSwitchModule, InputTextModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';


@NgModule({
  declarations: [StockListRouteComponent, StockColumnComponent, StockDetailsRouteComponent, StockFormComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    ShellContentPageModule,
    ShellTableModule,
    ShellDetailsFormModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    ShellInplaceEditModule,
    LocaleTextModule,
    LocaleTextEditModule,
    ButtonModule,
  ]
})
export class StockModule {
}
