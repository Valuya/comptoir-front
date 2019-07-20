import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockSelectComponent } from './stock-select.component';



@NgModule({
  declarations: [StockSelectComponent],
  imports: [
    CommonModule
  ],
  exports: [StockSelectComponent]
})
export class StockSelectModule { }
