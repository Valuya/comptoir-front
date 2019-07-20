import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleSelectComponent } from './locale-select.component';



@NgModule({
  declarations: [LocaleSelectComponent],
  imports: [
    CommonModule
  ],
  exports: [LocaleSelectComponent]
})
export class LocaleSelectModule { }
