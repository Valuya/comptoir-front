import {Injectable} from '@angular/core';
import {WsItemVariantPricingEnum} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor() {
  }


  getLabel(pricingEnum: WsItemVariantPricingEnum): string {
    if (pricingEnum == null) {
      return 'Aucun';
    }
    switch (pricingEnum) {
      case WsItemVariantPricingEnum.ABSOLUTE:
        return `Absolute`;
      case WsItemVariantPricingEnum.ADDTOBASE:
        return `Add to base`;
      case WsItemVariantPricingEnum.PARENTITEM:
        return `Same as parent`;
    }
    throw new Error('Unahdnled pricing: ' + pricingEnum);
  }
}
