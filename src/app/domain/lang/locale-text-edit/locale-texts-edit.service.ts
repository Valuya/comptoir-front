import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocaleService} from '../../../locale.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleTextsEditService {

  editingLocale$ = new BehaviorSubject<string | null>(null);

  constructor(private localeService: LocaleService) {
    this.localeService.getViewLocale$().pipe(
    ).subscribe(initLocale => this.editingLocale$.next(initLocale));
  }

  setEditingLocale(locale: string) {
    this.editingLocale$.next(locale);
  }

  getEditingLocale() {
    return this.editingLocale$.getValue();
  }

  getEditingLocale$(): Observable<string> {
    return this.editingLocale$;
  }
}
