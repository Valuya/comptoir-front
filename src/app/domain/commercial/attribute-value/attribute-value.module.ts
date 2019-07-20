import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeValueComponent } from './attribute-value.component';
import {AttributeDefinitionModule} from '../attribute-definition/attribute-definition.module';
import {AppModule} from '../../../app.module';



@NgModule({
  declarations: [AttributeValueComponent],
  imports: [
    CommonModule,
    AttributeDefinitionModule,
    AppModule
  ],
  exports: [AttributeValueComponent]
})
export class AttributeValueModule { }
