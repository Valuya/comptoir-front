import {SelectItem} from 'primeng/api';
import {WsSaleRef} from '@valuya/comptoir-ws-api';

export interface SaleSelectItem extends SelectItem {
  value: WsSaleRef;
}
