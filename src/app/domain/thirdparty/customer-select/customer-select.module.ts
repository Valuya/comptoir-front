import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSelectComponent } from './customer-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [CustomerSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  exports: [CustomerSelectComponent]
})
export class CustomerSelectModule { }
