import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PosSelectComponent} from './pos-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [PosSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule
  ],
  exports: [PosSelectComponent]
})
export class PosSelectModule {
}
