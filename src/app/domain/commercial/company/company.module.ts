import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';



@NgModule({
  declarations: [CompanyComponent],
  exports: [CompanyComponent],
  imports: [
    CommonModule,
    LocaleTextModule
  ]
})
export class CompanyModule { }
