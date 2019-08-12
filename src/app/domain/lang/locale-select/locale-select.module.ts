import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleSelectComponent} from './locale-select.component';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/primeng';
import {LocaleModule} from '../locale/locale.module';
import {ShellInplaceEditModule} from '../../../app-shell/shell-inplace-edit/shell-inplace-edit.module';


@NgModule({
  declarations: [LocaleSelectComponent],
  exports: [LocaleSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    LocaleModule,
    ShellInplaceEditModule,
  ],
})
export class LocaleSelectModule {
}
