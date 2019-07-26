import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SaleComponent} from './sale.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';


@NgModule({
  declarations: [SaleComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
    LocaleTextModule
  ],
  exports: [SaleComponent]
})
export class SaleComponentModule {
}
