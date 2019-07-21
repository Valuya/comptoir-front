export class FunctionsUtils {

  static splitDomainObjectCallback<T, U>(
    onValue: (value: T) => U,
    onEmptyId?: (value: T) => U,
    onNull?: () => U,
    idSelector: string = 'id',
  ): (value: T) => U {
    return (val: T) => {
      if (val == null) {
        return onNull ? onNull() : null;
      } else if (val[idSelector] == null) {
        return onEmptyId ? onEmptyId(val) : null;
      } else {
        return onValue ? onValue(val) : null;
      }
    };
  }

}
