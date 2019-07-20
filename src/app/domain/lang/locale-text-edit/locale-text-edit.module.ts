import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleTextEditComponent} from './locale-text-edit.component';
import {LocalizedEditDirective} from './localized-edit.directive';


@NgModule({
  declarations: [LocaleTextEditComponent, LocalizedEditDirective],
  imports: [
    CommonModule
  ],
  exports: [LocaleTextEditComponent, LocalizedEditDirective]
})
export class LocaleTextEditModule { }
