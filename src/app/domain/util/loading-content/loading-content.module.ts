import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingContentComponent} from './loading-content.component';


@NgModule({
  declarations: [LoadingContentComponent],
  exports: [LoadingContentComponent],
  imports: [
    CommonModule
  ]
})
export class LoadingContentModule {
}
