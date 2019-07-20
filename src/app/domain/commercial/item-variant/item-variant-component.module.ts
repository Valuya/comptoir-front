import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemVariantComponent} from './item-variant.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {ItemComponentModule} from '../item/item-component.module';


@NgModule({
  declarations: [ItemVariantComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
    ItemComponentModule
  ],
  exports: [ItemVariantComponent]
})
export class ItemVariantComponentModule {
}
