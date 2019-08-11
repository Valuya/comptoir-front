import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsCompanyRef, WsCountry} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {CountrySelectItem} from './country-select-item';
import {filter, map, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {CountryService} from '../country.service';
import {PaginationUtils} from '../../../util/pagination-utils';
import {SearchResult} from '../../../app-shell/shell-table/search-result';

interface CountryRef {
  code: string;
}

@Component({
  selector: 'cp-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CountrySelectComponent,
    multi: true
  }]
})
export class CountrySelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<CountryRef | null>(null);
  valueItem$: Observable<CountrySelectItem | null>;

  private onChange: (value: CountryRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<CountrySelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private countryService: CountryService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      map(country => this.createItem(country)),
      publishReplay(1), refCount()
    );
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

  fireChanges(newValue: CountryRef) {
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
    return this.searchCountryRefs$({}).pipe(
      map(results => results.list),
      switchMap(list => this.searchCountrys$(list)),
      map(list => saearchQuery == null ? [null, ...list] : list),
      map(list => list.map(item => this.createItem(item)))
    );
  }

  private fetchRef$(ref: CountryRef | null): Observable<WsCountry | null> {
    if (ref == null) {
      return of(null);
    }
    return this.countryService.getCountry$(ref.code);
  }

  private createItem(country: WsCountry): CountrySelectItem {
    if (country == null) {
      return {
        label: 'Aucun',
        ref: null
      };
    }
    return {
      label: `${country.code}`,
      ref: country.code
    };
  }

  private searchCountryRefs$(searchFilter: any): Observable<SearchResult<string>> {
    this.loadingSuggestions$.next(true);
    return this.countryService.searchCountryList$(searchFilter, PaginationUtils.create(10));
  }


  private searchCountrys$(codes: string[]) {
    if (codes == null || codes.length === 0) {
      return of([]);
    }
    const items$List = codes.map(ref => this.fetchRef$({code: ref}));
    return forkJoin(...items$List);
  }

}
