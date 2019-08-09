import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateSelectComponent} from './date-select.component';
import {CalendarModule, InputTextModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [DateSelectComponent],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    InputTextModule
  ],
  exports: [DateSelectComponent]
})
export class DateSelectModule { }
