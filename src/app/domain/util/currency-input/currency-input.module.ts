import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyInputComponent} from './currency-input.component';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/primeng';


@NgModule({
  declarations: [CurrencyInputComponent],
  exports: [CurrencyInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule
  ]
})
export class CurrencyInputModule {
}
