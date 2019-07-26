import {Component, Input, OnInit} from '@angular/core';
import {LocaleService} from 'src/app/locale.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {WsLocaleText} from './ws-locale-text';

@Component({
  selector: 'cp-locale-text',
  templateUrl: './locale-text.component.html',
  styleUrls: ['./locale-text.component.scss']
})
export class LocaleTextComponent implements OnInit {

  @Input()
  set localeTexts(value: WsLocaleText[]) {
    this.localeTextsSource$.next(value);
  }

  @Input()
  fallbackToOtherLanguage = true;

  localeTextsSource$ = new BehaviorSubject<WsLocaleText[]>([]);
  localizedValue$: Observable<string>;
  localizedValueLocale$: Observable<string>;
  viewLocale$: Observable<string>;

  constructor(private localeService: LocaleService) {
  }

  ngOnInit() {
    this.viewLocale$ = this.localeService.viewLocale$;
    const displayedText$ = combineLatest(this.localeTextsSource$, this.localeService.viewLocale$).pipe(
      map(results => this.getLocalizedValue(results[0], results[1])),
      publishReplay(1), refCount()
    );
    this.localizedValue$ = displayedText$.pipe(
      map(text => text == null ? null : text.text),
      publishReplay(1), refCount()
    );
    this.localizedValueLocale$ = displayedText$.pipe(
      map(text => text == null ? null : text.locale),
      publishReplay(1), refCount()
    );
  }

  private getLocalizedValue(texts: WsLocaleText[], localeCode: string) {
    if (texts == null || localeCode == null) {
      return null;
    }
    const found = texts
      .filter(text => text.text != null && text.text.length > 0)
      .find(text => text.locale === localeCode);
    if (found != null) {
      return found;
    }
    if (this.fallbackToOtherLanguage) {
      const mismatchText = texts.find(text => text.text != null && text.text.length > 0);
      return mismatchText;
    }
    return null;
  }
}
