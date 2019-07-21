import {WsAttributeDefinitionRef, WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';

export interface AttributeDefinitionSelectItem {
  definitionNameTexts: WsLocaleText[];
  definitionLabel: string;
  definitionRef?: WsAttributeDefinitionRef;
}
