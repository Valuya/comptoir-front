import {Component, Input, OnInit} from '@angular/core';
import {WsItem, WsItemVariant, WsItemVariantPricingEnum, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {delay, map, mergeMap, publishReplay, refCount, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {ItemService} from '../../../domain/commercial/item.service';
import {PricingUtils} from '../../../domain/util/pricing-utils';

@Component({
  selector: 'cp-variant-select-list-item',
  templateUrl: './variant-select-list-item.component.html',
  styleUrls: ['./variant-select-list-item.component.scss']
})
export class VariantSelectListItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsItemVariantRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  variant$: Observable<WsItemVariant>;
  variantAmountVatExclusive$: Observable<number>;
  variantAmountVatInclusive$: Observable<number>;

  constructor(
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.variant$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
    const variantItem$: Observable<WsItem | null> = this.variant$.pipe(
      switchMap(v => v == null ? of(null) : this.itemService.getItem$(v.itemRef)),
      publishReplay(1), refCount()
    );
    this.variantAmountVatExclusive$ = this.variant$.pipe(
      withLatestFrom(variantItem$, (variant, item) => PricingUtils.applyPricing(item.vatExclusive, variant.pricing, variant.pricingAmount)),
      publishReplay(1), refCount()
    );
    this.variantAmountVatInclusive$ = this.variantAmountVatExclusive$.pipe(
      withLatestFrom(variantItem$, (vatExcl, item) => PricingUtils.getVatInclusiveromVatExclusive(vatExcl, item.vatRate)),
      publishReplay(1), refCount()
    );

  }

  private loadRef$(ref: WsItemVariantRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.itemService.getItemVariant$(ref);
    return loaded$.pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }

  private calcVariantAmount$(variant: WsItemVariant): Observable<number> {
    if (variant == null) {
      return of(null);
    }
    return this.itemService.getItem$(variant.itemRef).pipe(
      map(item => PricingUtils.applyPricing(item.vatExclusive, variant.pricing, variant.pricingAmount)),
    );
  }
}
