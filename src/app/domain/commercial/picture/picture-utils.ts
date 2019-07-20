import {WsPicture} from '@valuya/comptoir-ws-api';

/**
 * Created by cghislai on 10/01/17.
 */

export class PictureUtils {

  static toDataURI(picture: WsPicture): string {
    if (picture == null) {
      return null;
    }
    if (picture.contentType !== undefined && picture.data !== undefined
      && picture.data.length > 0) {
      let uri = 'data:' + picture.contentType;
      uri += ';base64,' + picture.data;
      return uri;
    }
    return null;
  }

  static setPictureDatafromDataURI(dataURI: string, picture: WsPicture) {
    if (picture === undefined) {
      return;
    }
    const contentTypeStartIndex = 5; // 'data:' ...
    const contentTypeEndIndex = dataURI.indexOf(';');
    const dataStartIndex = contentTypeEndIndex + 8; // ';base64,' ...
    const dataEndIndex = dataURI.length;

    const contentType = dataURI.substring(contentTypeStartIndex, contentTypeEndIndex);
    const encodedData = dataURI.substring(dataStartIndex, dataEndIndex);
    picture.contentType = contentType;
    picture.data = encodedData as any;
  }

  static dataFromString(datastring: string): ArrayBuffer & ArrayLike<number> {
    const buf = new ArrayBuffer(datastring.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0; i < datastring.length; i++) {
      bufView[i] = datastring.charCodeAt(i);
    }
    const data: ArrayBuffer & ArrayLike<number> = Array.prototype.slice.call(bufView);
    return data;
  }
}
