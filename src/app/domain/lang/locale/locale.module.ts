import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleComponent } from './locale.component';



@NgModule({
  declarations: [LocaleComponent],
  imports: [
    CommonModule
  ],
  exports: [LocaleComponent]
})
export class LocaleModule { }
