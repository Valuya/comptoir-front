import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleTextComponent} from './locale-text.component';


@NgModule({
  declarations: [LocaleTextComponent],
  exports: [LocaleTextComponent],
  imports: [
    CommonModule
  ]
})
export class LocaleTextModule {
}
