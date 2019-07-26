import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeValuesSelectComponent } from './attribute-values-select.component';
import {AttributeValueModule} from '../attribute-value/attribute-value.module';
import {AutoCompleteModule, ButtonModule, ChipsModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {AttributeDefinitionSelectModule} from '../attribute-definition-select/attribute-definition-select.module';
import {LocaleTextEditModule} from '../../lang/locale-text-edit/locale-text-edit.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';
import {AttributeValuesModule} from '../attribute-values/attribute-values.module';



@NgModule({
  declarations: [AttributeValuesSelectComponent],
  imports: [
    CommonModule,
    AttributeValueModule,
    AutoCompleteModule,
    FormsModule,
    ChipsModule,
    AttributeDefinitionSelectModule,
    LocaleTextEditModule,
    ButtonModule,
    LocaleTextModule,
    AttributeValuesModule
  ],
  exports: [AttributeValuesSelectComponent]
})
export class AttributeValuesSelectModule { }
