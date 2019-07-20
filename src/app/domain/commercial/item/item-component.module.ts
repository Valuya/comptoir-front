import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemComponent} from './item.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';


@NgModule({
  declarations: [ItemComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
    LocaleTextModule
  ],
  exports: [ItemComponent]
})
export class ItemComponentModule {
}
