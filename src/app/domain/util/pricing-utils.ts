import {WsItemVariantPricingEnum} from '@valuya/comptoir-ws-api';

export class PricingUtils {

  static applyPricing(base: number, pricing: WsItemVariantPricingEnum, pricingAmount: number): number {
    switch (pricing) {
      case WsItemVariantPricingEnum.ABSOLUTE:
        return pricingAmount;
      case WsItemVariantPricingEnum.ADDTOBASE:
        return base + pricingAmount;
      case WsItemVariantPricingEnum.PARENTITEM:
        return base;
    }
  }
}
