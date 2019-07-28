import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTypeComponent } from './account-type.component';



@NgModule({
  declarations: [AccountTypeComponent],
  imports: [
    CommonModule
  ],
  exports: [AccountTypeComponent]
})
export class AccountTypeModule { }
