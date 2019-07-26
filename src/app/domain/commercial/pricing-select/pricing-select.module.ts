import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PricingSelectComponent} from './pricing-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [PricingSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  exports: [PricingSelectComponent]
})
export class PricingSelectModule { }
