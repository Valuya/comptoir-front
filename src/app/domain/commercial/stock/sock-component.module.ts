import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StockComponent} from './stock.component';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    LocaleTextModule,
    LoadingContentModule
  ],
  exports: [StockComponent]
})
export class SockComponentModule {
}
