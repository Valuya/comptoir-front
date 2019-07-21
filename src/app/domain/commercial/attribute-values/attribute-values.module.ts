import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeValuesComponent} from './attribute-values.component';
import {WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {ChipsModule} from 'primeng/chips';
import {FormsModule} from '@angular/forms';
import {AttributeValueModule} from '../attribute-value/attribute-value.module';
import {AttributeDefinitionModule} from '../attribute-definition/attribute-definition.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';


@NgModule({
  declarations: [AttributeValuesComponent],
  imports: [
    CommonModule,
    ChipsModule,
    FormsModule,
    AttributeValueModule,
    AttributeDefinitionModule,
    LocaleTextModule
  ],
  exports: [AttributeValuesComponent]
})
export class AttributeValuesModule {

  @Input()
  valueRefs: WsAttributeValueRef[];
}
