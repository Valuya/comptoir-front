import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item.component';
import {AppModule} from '../../../app.module';



@NgModule({
  declarations: [ItemComponent],
  imports: [
    CommonModule,
    AppModule
  ],
  exports: [ItemComponent]
})
export class ItemModule { }
