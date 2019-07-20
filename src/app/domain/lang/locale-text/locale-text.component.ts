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

  localeTextsSource$ = new BehaviorSubject<WsLocaleText[]>([]);
  localizedValue$: Observable<string>;
  locale$: Observable<string>;

  constructor(private localeService: LocaleService) {
  }

  ngOnInit() {
    this.locale$ = this.localeService.viewLocale$;
    this.localizedValue$ = combineLatest(this.localeTextsSource$, this.localeService.viewLocale$).pipe(
      map(results => this.getLocalizedValue(results[0], results[1])),
      publishReplay(1), refCount()
    );
  }

  private getLocalizedValue(texts: WsLocaleText[], localeCode: string) {
    if (texts == null || localeCode == null) {
      return null;
    }
    const found = texts.find(text => text.locale === localeCode);
    return found == null ? null : found.text;
  }
}
