import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './country.component';
import {LoadingContentModule} from '../loading-content/loading-content.module';



@NgModule({
  declarations: [CountryComponent],
  imports: [
    CommonModule,
    LoadingContentModule
  ],
  exports: [CountryComponent]
})
export class CountryModule { }
