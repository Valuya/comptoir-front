import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosComponent } from './pos.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';



@NgModule({
  declarations: [PosComponent],
  imports: [
    CommonModule,
    LoadingContentModule
  ],
  exports: [PosComponent]
})
export class PosModule { }
