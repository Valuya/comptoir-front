import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountComponent} from './account.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    LoadingContentModule,
  ],
  exports: [AccountComponent]
})
export class AccountModule { }
