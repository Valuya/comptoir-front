import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeDefinitionSelectComponent } from './attribute-definition-select.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {AttributeDefinitionModule} from '../attribute-definition/attribute-definition.module';



@NgModule({
  declarations: [AttributeDefinitionSelectComponent],
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    AttributeDefinitionModule
  ],
  exports: [AttributeDefinitionSelectComponent]
})
export class AttributeDefinitionSelectModule { }
