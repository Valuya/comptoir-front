import {WsAttributeDefinitionRef, WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';
import {AttributeDefinitionSelectItem} from './attribute-definition-select-item';

export interface AttributeSelectItem extends AttributeDefinitionSelectItem {
  valueTexts: WsLocaleText[];
  valueLabel: string;
  label: string;
  valueRef?: WsAttributeValueRef;
}
