import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRangeSelectComponent} from './date-range-select.component';
import {ShellInplaceEditModule} from '../../../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {DateSelectModule} from '../date-select/date-select.module';
import {FormsModule} from '@angular/forms';
import {DateRangeModule} from '../date-range/date-range.module';


@NgModule({
  declarations: [DateRangeSelectComponent],
  exports: [DateRangeSelectComponent],
  imports: [
    CommonModule,
    ShellInplaceEditModule,
    DateSelectModule,
    FormsModule,
    DateRangeModule
  ]
})
export class DateRangeSelectModule {
}
