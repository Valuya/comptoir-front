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
import {CalendarModule, InputSwitchModule, InputTextModule, SpinnerModule, TabMenuModule, TriStateCheckboxModule} from 'primeng/primeng';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {SaleFilterComponent} from './sale-filter/sale-filter.component';
import {CustomerSelectModule} from '../domain/thirdparty/customer-select/customer-select.module';
import {CustomerModule} from '../domain/thirdparty/customer/customer.module';
import {DateSelectModule} from '../domain/util/date-select/date-select.module';
import {SaleVariantColumnComponent} from './sale-variant-column/sale-variant-column.component';
import {SaleVariantFormComponent} from './sale-variant-form/sale-variant-form.component';
import {SaleDetailsFormRouteComponent} from './sale-details-form-route/sale-details-form-route.component';
import {SaleDetailsVariantsRouteComponent} from './sale-details-variants-route/sale-details-variants-route.component';
import {SaleDetailsVariantDetailsRouteComponent} from './sale-details-variant-details-route/sale-details-variant-details-route.component';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {ItemVariantComponentModule} from '../domain/commercial/item-variant/item-variant-component.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {SockComponentModule} from '../domain/commercial/stock/sock-component.module';
import {SaleComponentModule} from '../domain/commercial/sale/sale-component.module';
import {PercentInputModule} from '../domain/util/percent-input/percent-input.module';
import {CurrencyInputModule} from '../domain/util/currency-input/currency-input.module';


@NgModule({
  declarations: [
    SaleListRouteComponent,
    SaleColumnComponent,
    SaleDetailsRouteComponent,
    SaleFormComponent,
    SaleFilterComponent,
    SaleVariantColumnComponent,
    SaleVariantFormComponent,
    SaleDetailsFormRouteComponent,
    SaleDetailsVariantsRouteComponent,
    SaleDetailsVariantDetailsRouteComponent
  ],
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
    TabMenuModule,
    LocaleTextModule,
    ItemVariantComponentModule,
    SpinnerModule,
    LocaleTextEditModule,
    SockComponentModule,
    SaleComponentModule,
    PercentInputModule,
    CurrencyInputModule,
  ]
})
export class SaleModule {
}
