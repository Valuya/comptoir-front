import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTypeSelectComponent } from './account-type-select.component';
import {DropdownModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [AccountTypeSelectComponent],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  exports: [AccountTypeSelectComponent]
})
export class AccountTypeSelectModule { }
