import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeComponent } from './date-range.component';



@NgModule({
  declarations: [DateRangeComponent],
  exports: [
    DateRangeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DateRangeModule { }
