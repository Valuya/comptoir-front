export class HeaderUtils {


  static tobasicAuthHeader(user: string, pass: string): string {
    const concatenated = user + ':' + pass;
    const encoded = btoa(concatenated);
    const header = 'Basic ' + encoded;
    return header;
  }

  static toBearerAuthHeader(token: string) {
    const base64Token = btoa(token);
    return `Bearer ${base64Token}`;
  }

  static findHeaderIgnoreCase(name: string, headers: Headers | string[][] | Record<string, string>): Record<string, string> | null {
    const checkValue = name.toLocaleLowerCase();
    const foundValue: Record<string, string> = {};

    if (headers == null) {
      return null;
    }

    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        if (key.toLocaleLowerCase().indexOf(checkValue) >= 0) {
          foundValue[key] = value;
        }
      });
    } else if (headers instanceof Array) {
      for (const headerArray of headers) {
        if (headerArray instanceof Array && headerArray.length > 0) {
          const headerKey: string = headerArray[0];
          const headerVal = headerArray[1];
          if (headerKey.toLocaleLowerCase().indexOf(checkValue) >= 0) {
            foundValue[headerKey] = headerVal;
          }
        }
      }
    } else {
      const keys = Object.keys(headers);
      for (const key of keys) {
        const value = headers[key];
        if (key.toLocaleLowerCase().indexOf(checkValue) >= 0) {
          foundValue[key] = value;
        }
      }
    }

    const foundKeys = Object.keys(foundValue);
    return foundKeys.length === 0 ? null : foundValue;
  }
}
