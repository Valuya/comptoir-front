import {Injectable} from '@angular/core';
import {WsAccountAccountTypeEnum} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {

  constructor() {
  }

  getLabel(accountType: WsAccountAccountTypeEnum) {
    if (accountType == null) {
      return null;
    }
    switch (accountType) {
      case WsAccountAccountTypeEnum.OTHER:
        return 'Autre';
      case WsAccountAccountTypeEnum.PAYMENT:
        return 'Paiement';
      case WsAccountAccountTypeEnum.VAT:
        return 'TVA';
      default:
        throw new Error('Unhandled account type: ' + accountType);
    }
  }


}
