import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleSelectComponent} from './locale-select.component';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/primeng';


@NgModule({
  declarations: [LocaleSelectComponent],
  exports: [LocaleSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
  ],
})
export class LocaleSelectModule {
}
