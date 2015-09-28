/**
 * Created by cghislai on 09/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class JSONFactory {
    static toJSONReplacer(key:string, value:any):any {
        if (value !== undefined && value != null && value._isLocalTexts) {
            var localeTextArray = LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
            return localeTextArray;
        }
        return value;
    }
}