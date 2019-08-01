export class NumberUtils {

  static toFixedDecimals(value: number | string, decimals: number = 2): number {
    if (value == null) {
      return 0;
    }
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    const fixedString = value.toFixed(decimals);
    return parseFloat(fixedString);
  }
}
