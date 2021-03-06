import {WsItemVariantPricingEnum, WsItemVariantSale, WsSale} from '@valuya/comptoir-ws-api';
import {NumberUtils} from '../../util/number-utils';

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

  static getVatExclusviveFromTotal(totalValue: number, curVatRate: number, discountRate: number) {
    const withoutVat = totalValue / (1 + curVatRate);
    const withoutDiscount = withoutVat / (1 - discountRate);
    return PricingUtils.fixedDecimals(withoutDiscount);
  }

  static getVatInclusiveromVatExclusive(vatExclusiveValue: number, curVatRate: number) {
    const totalValue = vatExclusiveValue * (1 + curVatRate);
    return PricingUtils.fixedDecimals(totalValue);
  }

  static fixedDecimals(priceValue: number): number {
    return NumberUtils.toFixedDecimals(priceValue, 4);
  }
}
