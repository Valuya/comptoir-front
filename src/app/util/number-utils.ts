export class NumberUtils {

  static toFixedDecimals(value: number, decimals: number = 2): number {
    const fixedString = value.toFixed(decimals);
    return parseFloat(fixedString);
  }
}
