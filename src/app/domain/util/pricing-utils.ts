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

  static vatExclusviveFromTotal(totalValue: number, curVatRate: number) {
    const vatExclusive = totalValue * (1 / (1 + curVatRate));
    return PricingUtils.fixedDecimals(vatExclusive);
  }

  static totalFromVatExclusive(vatExclusiveValue: number, curVatRate: number) {
    const totalValue = vatExclusiveValue * (1 + curVatRate);
    return PricingUtils.fixedDecimals(totalValue);
  }

  static fixedDecimals(priceValue: number): number {
    const fixedDecimalString = priceValue.toFixed(3);
    return parseFloat(fixedDecimalString);
  }
}
