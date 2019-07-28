import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PercentInputComponent} from './percent-input.component';
import {SpinnerModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [PercentInputComponent],
  exports: [PercentInputComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    FormsModule
  ]
})
export class PercentInputModule { }
