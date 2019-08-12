import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleTextEditComponent} from './locale-text-edit.component';
import {LocalizedEditDirective} from './localized-edit.directive';
import {LocaleSelectModule} from '../locale-select/locale-select.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [LocaleTextEditComponent, LocalizedEditDirective],
  imports: [
    CommonModule,
    LocaleSelectModule,
    FormsModule
  ],
  exports: [LocaleTextEditComponent, LocalizedEditDirective]
})
export class LocaleTextEditModule { }
