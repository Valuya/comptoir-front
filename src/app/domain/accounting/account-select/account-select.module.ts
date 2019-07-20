import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountSelectComponent} from './account-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [AccountSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  exports: [AccountSelectComponent]
})
export class AccountSelectModule { }
