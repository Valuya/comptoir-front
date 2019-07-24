import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemVariantComponent} from './item-variant.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {ItemComponentModule} from '../item/item-component.module';
import {PictureModule} from '../picture/picture.module';


@NgModule({
  declarations: [ItemVariantComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
    ItemComponentModule,
    PictureModule
  ],
  exports: [ItemVariantComponent]
})
export class ItemVariantComponentModule {
}
