import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleSelectComponent } from './sale-select.component';



@NgModule({
  declarations: [SaleSelectComponent],
  imports: [
    CommonModule
  ],
  exports: [SaleSelectComponent]
})
export class SaleSelectModule { }
