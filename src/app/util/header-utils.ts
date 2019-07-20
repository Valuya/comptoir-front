export class HeaderUtils {


  static tobasicAuthHeader(user: string, pass: string): string {
    const concatenated = user + ':' + pass;
    const encoded = btoa(concatenated);
    const header = 'Basic ' + encoded;
    return header;
  }
}
