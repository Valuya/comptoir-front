import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, publishReplay, refCount} from 'rxjs/operators';

@Component({
  selector: 'cp-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.scss']
})
export class LocaleComponent implements OnInit {

  @Input()
  set locale(value: string) {
    this.localeSource$.next(value);
  }

  @Input()
  showFlag = true;
  @Input()
  showCode: boolean;

  localeSource$ = new BehaviorSubject<string | null>(null);
  flagCssClass$: Observable<string>;

  constructor() {
  }

  ngOnInit() {
    this.flagCssClass$ = this.localeSource$.pipe(
      map(locale => this.getFlagCssClass(locale)),
      publishReplay(1), refCount()
    );
  }

  private getFlagCssClass(locale: string) {
    if (locale == null) {
      return null;
    }
    const countryCode = this.getCountryCodeForLocale(locale);
    return `flag-icon flag-icon-${countryCode}`;
  }

  private getCountryCodeForLocale(locale: string) {
    switch (locale) {
      case 'en':
        return 'gb';
      default:
        return locale;
    }
  }
}
