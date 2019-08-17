import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsItemVariantPricingEnum,} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PricingSelectItem} from './pricing-select-item';
import {PricingService} from '../pricing/pricing.service';

@Component({
  selector: 'cp-pricing-select',
  templateUrl: './pricing-select.component.html',
  styleUrls: ['./pricing-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PricingSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsItemVariantPricingEnum | null>(null);
  valueItem$: Observable<PricingSelectItem | null>;

  private onChange: (value: WsItemVariantPricingEnum) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<PricingSelectItem[]>;

  constructor(
    private pricingService: PricingService,
  ) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      map(pricing => this.createItem(pricing)),
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

  fireChanges(newValue: WsItemVariantPricingEnum) {
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
    const suggestions = [
      WsItemVariantPricingEnum.ABSOLUTE,
      WsItemVariantPricingEnum.ADDTOBASE,
      WsItemVariantPricingEnum.PARENTITEM,
    ]
      .map(item => this.createItem(item));

    return of(this.filterQUery(suggestions, saearchQuery));
  }

  private createItem(pricing: WsItemVariantPricingEnum): PricingSelectItem {
    if (pricing == null) {
      return {
        label: 'None',
        value: null
      };
    }
    const labelValue = this.pricingService.getLabel(pricing);
    return {
      label: labelValue,
      value: pricing
    };
  }


  private filterQUery(items: PricingSelectItem[], saearchQuery: string) {
    return items.filter(item => item.label.toLocaleLowerCase().indexOf(saearchQuery.toLocaleLowerCase()) >= 0);
  }
}

