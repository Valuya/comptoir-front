import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './customer.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';


@NgModule({
  declarations: [CustomerComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
  ],
  exports: [CustomerComponent]
})
export class CustomerModule {
}
