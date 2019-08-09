import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComptoirRoutingModule} from './comptoir-routing.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ComptoirSaleRouteComponent} from './comptoir-sale-route/comptoir-sale-route.component';
import {ComptoirSaleFillRouteComponent} from './comptoir-sale-fill-route/comptoir-sale-fill-route.component';
import {ComptoirSalePayRouteComponent} from './comptoir-sale-pay-route/comptoir-sale-pay-route.component';
import {ComptoirInfoRouteComponent} from './comptoir-info-route/comptoir-info-route.component';
import {SaleItemListComponent} from './sale-item-list/sale-item-list.component';
import {DataViewModule} from 'primeng/dataview';
import {
  AutoCompleteModule,
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  InplaceModule,
  InputSwitchModule,
  InputTextModule,
  PanelModule,
  SpinnerModule,
  TabMenuModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {ItemSelectListComponent} from './item-select-list/item-select-list.component';
import {VariantSelectListComponent} from './variant-select-list/variant-select-list.component';
import {VariantSelectListItemComponent} from './variant-select-list/variant-select-list-item/variant-select-list-item.component';
import {VariantSelectGridItemComponent} from './variant-select-list/variant-select-grid-item/variant-select-grid-item.component';
import {ItemAndVariantSelectListComponent} from './item-and-variant-select-list/item-and-variant-select-list.component';
import {SaleItemListItemComponent} from './sale-item-list/sale-item-list-item/sale-item-list-item.component';
import {SaleItemGridItemComponent} from './sale-item-list/sale-item-grid-item/sale-item-grid-item.component';
import {ItemSelectListItemComponent} from './item-select-list/item-select-list-item/item-select-list-item.component';
import {ItemSelectGridItemComponent} from './item-select-list/item-select-grid-item/item-select-grid-item.component';
import {LoadingContentModule} from '../domain/util/loading-content/loading-content.module';
import {PictureModule} from '../domain/commercial/picture/picture.module';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {ItemComponentModule} from '../domain/commercial/item/item-component.module';
import {AttributeValuesModule} from '../domain/commercial/attribute-values/attribute-values.module';
import {PosSelectModule} from '../domain/commercial/pos-select/pos-select.module';
import {CustomerSelectModule} from '../domain/thirdparty/customer-select/customer-select.module';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {ItemVariantComponentModule} from '../domain/commercial/item-variant/item-variant-component.module';
import {SockComponentModule} from '../domain/commercial/stock/sock-component.module';
import {StockSelectModule} from '../domain/commercial/stock-select/stock-select.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {ActiveSaleHeaderComponent} from './active-sale-header/active-sale-header.component';
import {ActiveSaleDetailsComponent} from './active-sale-header/active-sale-details/active-sale-details.component';
import {CustomerModule} from '../domain/thirdparty/customer/customer.module';
import {ActiveSaleSelectComponent} from './active-sale-header/active-sale-select/active-sale-select.component';
import {AccountSelectListComponent} from './account-select-list/account-select-list.component';
import {AccountSelectListItemComponent} from './account-select-list/account-select-list-item/account-select-list-item.component';
import {AccountSelectGridItemComponent} from './account-select-list/account-select-grid-item/account-select-grid-item.component';
import {SaleTransactionInputComponent} from './sale-transaction-input/sale-transaction-input.component';
import {AccountComponentModule} from '../domain/accounting/account/account.module';
import {SaleAccountingEntriesListComponent} from './sale-accounting-entries-list/sale-accounting-entries-list.component';
import {AppShellModule} from '../app-shell/app-shell.module';
import {PercentInputModule} from '../domain/util/percent-input/percent-input.module';
import {CurrencyInputModule} from '../domain/util/currency-input/currency-input.module';
import {SaleSelectGridItemComponent} from './sale-select-list/sale-select-grid-item/sale-select-grid-item.component';
import {SaleSelectListComponent} from './sale-select-list/sale-select-list.component';
import {SaleSelectListItemComponent} from './sale-select-list/sale-select-list-item/sale-select-list-item.component';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
    ComptoirSaleRouteComponent,
    ComptoirSaleFillRouteComponent,
    ComptoirSalePayRouteComponent,
    ComptoirInfoRouteComponent,
    SaleItemListComponent,
    SaleItemListItemComponent,
    SaleItemGridItemComponent,
    ItemSelectListComponent,
    ItemSelectListItemComponent,
    ItemSelectGridItemComponent,
    VariantSelectListComponent,
    VariantSelectListItemComponent,
    VariantSelectGridItemComponent,
    ItemAndVariantSelectListComponent,
    ActiveSaleHeaderComponent,
    ActiveSaleDetailsComponent,
    ActiveSaleSelectComponent,
    AccountSelectListComponent,
    AccountSelectListItemComponent,
    AccountSelectGridItemComponent,
    SaleTransactionInputComponent,
    SaleAccountingEntriesListComponent,
    SaleSelectListItemComponent,
    SaleSelectGridItemComponent,
    SaleSelectListComponent,
  ],
  imports: [
    CommonModule,
    ComptoirRoutingModule,
    ShellContentPageModule,
    DataViewModule,
    DropdownModule,
    FormsModule,
    LoadingContentModule,
    PictureModule,
    LocaleTextModule,
    ItemComponentModule,
    AttributeValuesModule,
    PosSelectModule,
    CustomerSelectModule,
    ShellInplaceEditModule,
    SpinnerModule,
    ItemVariantComponentModule,
    InputTextModule,
    InputSwitchModule,
    SockComponentModule,
    StockSelectModule,
    LocaleTextEditModule,
    CheckboxModule,
    CustomerModule,
    AutoCompleteModule,
    ButtonModule,
    AccountComponentModule,
    PanelModule,
    InplaceModule,
    AppShellModule,
    PercentInputModule,
    CurrencyInputModule,
    ToastModule,
    TabMenuModule,
  ]
})
export class ComptoirModule {
}
