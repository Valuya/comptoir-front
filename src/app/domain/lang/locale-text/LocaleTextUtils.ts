import {WsLocaleText} from './ws-locale-text';

export class LocaleTextUtils {

  static findLocalizedText(texts: WsLocaleText[], locale: string, fallbackToOtherLanguage = true): WsLocaleText | null {
    const textsWithContent = texts.filter(t => t.text != null && t.text.length > 0);
    const matchingText = textsWithContent.find(t => t.locale === locale);
    if (matchingText != null) {
      return matchingText;
    }
    if (fallbackToOtherLanguage) {
      const otherText = textsWithContent.length > 0 ? textsWithContent[0] : null;
      return otherText;
    }
    return null;
  }

  static filterValidTexts(valueTexts: WsLocaleText[]) {
    return valueTexts.filter(t => t.text != null && t.locale != null);
  }
}
