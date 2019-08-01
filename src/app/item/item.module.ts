import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ItemRoutingModule} from './item-routing.module';
import {ItemColumnComponent} from './item-column/item-column.component';
import {ItemFormComponent} from './item-form/item-form.component';
import {ItemListRouteComponent} from './item-list-route/item-list-route.component';
import {ItemDetailsRouteComponent} from './item-details-route/item-details-route.component';
import {ItemVariantFormComponent} from './item-variant-form/item-variant-form.component';
import {ItemVariantColumnComponent} from './item-variant-column/item-variant-column.component';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ButtonModule} from 'primeng/button';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {FormsModule} from '@angular/forms';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {InputSwitchModule, InputTextModule, SpinnerModule, TabMenuModule} from 'primeng/primeng';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {PictureModule} from '../domain/commercial/picture/picture.module';
import {PictureUploadModule} from '../domain/commercial/picture-upload/picture-upload.module';
import {ItemDetailFormRouteComponent} from './item-detail-form-route/item-detail-form-route.component';
import {ItemDetailVariantsRouteComponent} from './item-detail-variants-route/item-detail-variants-route.component';
import {ItemComponentModule as ItemComponentModule} from '../domain/commercial/item/item-component.module';
import {PricingModule} from '../domain/commercial/pricing/pricing.module';
import {ItemDetailVariantDetailRouteComponent} from './item-detail-variant-detail-route/item-detail-variant-detail-route.component';
import {PricingSelectModule} from '../domain/commercial/pricing-select/pricing-select.module';
import {AttributeValuesModule} from '../domain/commercial/attribute-values/attribute-values.module';
import {AttributeValuesSelectModule} from '../domain/commercial/attribute-values-select/attribute-values-select.module';
import {PercentInputModule} from '../domain/util/percent-input/percent-input.module';
import {CurrencyInputModule} from '../domain/util/currency-input/currency-input.module';


@NgModule({
  declarations: [
    ItemColumnComponent,
    ItemFormComponent,
    ItemListRouteComponent,
    ItemDetailsRouteComponent,
    ItemVariantFormComponent,
    ItemVariantColumnComponent,
    ItemDetailFormRouteComponent,
    ItemDetailVariantsRouteComponent,
    ItemDetailVariantDetailRouteComponent
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    ShellTableModule,
    ShellContentPageModule,
    ButtonModule,
    ShellDetailsFormModule,
    FormsModule,
    ShellInplaceEditModule,
    InputSwitchModule,
    LocaleTextModule,
    LocaleTextEditModule,
    InputTextModule,
    SpinnerModule,
    PictureModule,
    PictureUploadModule,
    TabMenuModule,
    ItemComponentModule,
    PricingModule,
    PricingSelectModule,
    AttributeValuesModule,
    AttributeValuesSelectModule,
    PercentInputModule,
    CurrencyInputModule,
  ]
})
export class ItemModule {
}
