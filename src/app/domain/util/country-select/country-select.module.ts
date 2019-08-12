import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CountrySelectComponent} from './country-select.component';
import {FormsModule} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/primeng';
import {CountryModule} from '../country/country.module';


@NgModule({
  declarations: [CountrySelectComponent],
  exports: [CountrySelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    CountryModule,
  ]
})
export class CountrySelectModule {
}
