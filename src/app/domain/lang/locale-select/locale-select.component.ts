import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {PaginationUtils} from '../../../util/pagination-utils';
import {SearchResult} from '../../../app-shell/shell-table/search-result';
import {LocaleService} from '../../../locale.service';

@Component({
  selector: 'cp-locale-select',
  templateUrl: './locale-select.component.html',
  styleUrls: ['./locale-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: LocaleSelectComponent,
    multi: true
  }]
})
export class LocaleSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<string | null>(null);

  private onChange: (value: string) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<string[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private localeService: LocaleService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.suggestions$ = this.suggestionQuerySource$.pipe(
      switchMap(searchQuery => this.searchSuggestions$(searchQuery)),
      publishReplay(1), refCount(),
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.valueSource$.next(obj);
  }

  fireChanges(newValue: string) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  onSearchQuery(event: { query: string }) {
    this.suggestionQuerySource$.next(event.query);
  }

  private searchSuggestions$(saearchQuery: string) {
    return this.localeService.getSupportedLocales$();
  }


}
