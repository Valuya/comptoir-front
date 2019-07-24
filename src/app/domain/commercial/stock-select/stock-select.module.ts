import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockSelectComponent } from './stock-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [StockSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  exports: [StockSelectComponent]
})
export class StockSelectModule { }
