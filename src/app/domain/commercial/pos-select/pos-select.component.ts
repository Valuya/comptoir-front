import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsCompanyRef, WsPos, WsPosRef, WsPosSearch} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {PosSelectItem} from './pos-select-item';
import {filter, map, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {PosService} from '../pos.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-pos-select',
  templateUrl: './pos-select.component.html',
  styleUrls: ['./pos-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PosSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsPosRef | null>(null);
  valueItem$: Observable<PosSelectItem | null>;

  private onChange: (value: WsPosRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<PosSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(
    private posService: PosService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      map(pos => this.createItem(pos)),
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

  fireChanges(newValue: WsPosRef) {
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
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createSearchFilter(companyRef, saearchQuery)),
      switchMap(searchFilter => this.searchPosRefs$(searchFilter)),
      map(results => results.list),
      switchMap(list => this.searchPoss$(list)),
      map(list => saearchQuery == null ? [null, ...list] : list),
      map(list => list.map(item => this.createItem(item)))
    );
  }

  private fetchRef$(ref: WsPosRef | null): Observable<WsPos | null> {
    if (ref == null) {
      return of(null);
    }
    return this.posService.getPos$(ref);
  }

  private createItem(pos: WsPos): PosSelectItem {
    if (pos == null) {
      return {
        label: 'Aucun',
        ref: null
      };
    }
    return {
      label: `${pos.name}`,
      ref: {
        id: pos.id,
      }
    };
  }

  private searchPosRefs$(searchFilter: WsPosSearch) {
    this.loadingSuggestions$.next(true);
    return this.posService.searchPosList$(searchFilter, PaginationUtils.create(10)).pipe(
      tap(a => this.loadingSuggestions$.next(false))
    );
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsPosSearch {
    return {
      companyRef: companyRef as object,
    };
  }

  private searchPoss$(list: WsPosRef[]) {
    if (list == null || list.length === 0) {
      return [];
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }

}
