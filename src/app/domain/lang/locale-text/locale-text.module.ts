import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleTextComponent} from './locale-text.component';
import {AppShellModule} from '../../../app-shell/app-shell.module';


@NgModule({
  declarations: [LocaleTextComponent],
  exports: [LocaleTextComponent],
  imports: [
    CommonModule,
    AppShellModule
  ]
})
export class LocaleTextModule {
}
