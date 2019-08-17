import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
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
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocaleSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  @Input()
  showFlag = true;
  @Input()
  showCode: boolean;

  valueSource$ = new BehaviorSubject<string | null>(null);

  private onChange: (value: string) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<string[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  supportedLocales$: Observable<string[]>;

  constructor(private localeService: LocaleService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.suggestions$ = this.suggestionQuerySource$.pipe(
      switchMap(searchQuery => this.searchSuggestions$(searchQuery)),
      publishReplay(1), refCount(),
    );
    this.supportedLocales$ = this.localeService.getSupportedLocales$();
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
    this.valueSource$.next(newValue);
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
