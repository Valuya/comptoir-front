import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {BehaviorSubject, concat, Observable, of, Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {filter, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  viewLocale$: Observable<string>;

  private localeChanges = new Subject<string>();

  constructor(@Inject(LOCALE_ID) private appLocale: string,
              private authService: AuthService) {
    const employeeLocaleAndUpdates$ = this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      map(e => e.locale as any as string),
      switchMap(employeeLocale => this.concatEmployeeLocaleWithLocaleChanges$(employeeLocale)),
    );
    this.viewLocale$ = concat(
      of(this.appLocale),
      employeeLocaleAndUpdates$
    ).pipe(
      publishReplay(1), refCount()
    );
  }

  setViewLocale(locale: string) {
    this.localeChanges.next(locale);
  }

  getViewLocale$(): Observable<string> {
    return this.viewLocale$;
  }

  private concatEmployeeLocaleWithLocaleChanges$(employeeLocale: string): Observable<string> {
    return concat(
      of(employeeLocale),
      this.localeChanges,
    );
  }
}
