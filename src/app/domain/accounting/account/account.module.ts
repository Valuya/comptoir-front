import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
    LocaleTextModule,
  ],
  exports: [AccountComponent]
})
export class AccountComponentModule { }
