import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsCompanyRef, WsItemVariantSaleSearch, WsSale, WsSalePriceDetails, WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleService} from '../sale.service';
import {AuthService} from '../../../auth.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleComponent implements OnInit {

  @Input()
  set ref(value: WsSaleRef) {
    this.refSource$.next(value);
  }

  @Input()
  showId: boolean;
  @Input()
  showIcon: boolean;
  @Input()
  showReference: boolean;
  @Input()
  showVatExclusive: boolean;
  @Input()
  showVat: boolean;
  @Input()
  showTotal: boolean;
  @Input()
  showDateTime: boolean;
  @Input()
  showItemCount: boolean;

  private refSource$ = new BehaviorSubject<WsSaleRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  loadingItemCount$ = new BehaviorSubject<boolean>(false);

  value$: Observable<WsSale>;
  itemCount$: Observable<number>;
  price$: Observable<WsSalePriceDetails>;
  total$: Observable<number>;

  constructor(
    private saleService: SaleService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
    this.itemCount$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.searchItemCount$(ref)),
      publishReplay(1), refCount()
    );
    this.price$ = this.refSource$.pipe(
      switchMap(ref => this.searchSalePrice$(ref)),
      publishReplay(1), refCount()
    );
    this.total$ = this.price$.pipe(
      map(p => p.totalPriceVatInclusive),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsSaleRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.saleService.getSale$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }

  private searchItemCount$(ref: WsSaleRef) {
    if (ref == null) {
      return of(0);
    }
    this.loadingItemCount$.next(true);
    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      map(companyRef => this.createItemCountFilter(companyRef, ref)),
      switchMap(searchFilter => this.saleService.searchVariants$(searchFilter, PaginationUtils.create(0))),
      map(results => results.totalCount),
      delay(0),
      tap(def => this.loadingItemCount$.next(false))
    );
  }

  private createItemCountFilter(companyRefVal: WsCompanyRef, saleRefVal: WsSaleRef): WsItemVariantSaleSearch {
    return {
      saleRef: saleRefVal,
      companyRef: companyRefVal
    };
  }

  private searchSalePrice$(ref: WsSaleRef) {
    if (ref == null) {
      return of(null);
    }
    return this.saleService.getSalePriceDetails$(ref);
  }
}
