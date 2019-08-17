import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsCompanyRef, WsItemVariantSale, WsItemVariantSaleRef, WsItemVariantSaleSearch, WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {AuthService} from '../../auth.service';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {SaleService} from '../../domain/commercial/sale.service';
import {PaginationUtils} from '../../util/pagination-utils';
import {SaleVariantColumns} from '../sale-variant-column/sale-variant-columns';
import {VariantSaleWithPrice} from '../../domain/commercial/item-variant-sale/variant-sale-with-price';

@Component({
  selector: 'cp-sale-print',
  templateUrl: './sale-print.component.html',
  styleUrls: ['./sale-print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalePrintComponent implements OnInit {

  SALE_VARIANTS_COLUMNS = SaleVariantColumns;

  @Input()
  set ref(value: WsSaleRef) {
    this.refSource$.next(value);
  }

  refSource$ = new BehaviorSubject<WsSaleRef | null>(null);
  sale$: Observable<WsSale | null>;
  companyRef$: Observable<WsCompanyRef>;
  itemRefs$: Observable<WsItemVariantSaleRef[]>;
  itemsWithPrice$: Observable<VariantSaleWithPrice[]>;

  constructor(private authService: AuthService,
              private saleService: SaleService
  ) {
  }

  ngOnInit() {
    this.sale$ = this.refSource$.pipe(
      switchMap(ref => this.saleService.getSale$(ref)),
      publishReplay(1), refCount()
    );
    this.itemRefs$ = this.refSource$.pipe(
      switchMap(ref => this.searchItemsRefs$(ref)),
      publishReplay(1), refCount()
    );
    this.itemsWithPrice$ = this.itemRefs$.pipe(
      switchMap(refs => this.searchItems$(refs))
    );
    this.companyRef$ = this.authService.getNextNonNullLoggedEmployeeCompanyRef$();
  }

  onBackClicked($event: MouseEvent) {
    window.history.back();
  }

  private searchItemsRefs$(ref: WsSaleRef) {
    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      map(companyRefVal => {
        const searcHfilter: WsItemVariantSaleSearch = {
          companyRef: companyRefVal,
          saleRef: ref,
        };
        return searcHfilter;
      }),
      switchMap(searchFilter => this.saleService.searchVariants$(searchFilter, PaginationUtils.create(1000))),
      map(r => r.list)
    );
  }

  private searchItems$(refs: WsItemVariantSaleRef[]): Observable<VariantSaleWithPrice[]> {
    if (refs == null || refs.length === 0) {
      return of([]);
    }
    const item$List = refs.map(ref => this.saleService.getVariantWithPrice$(ref));
    return forkJoin(item$List);
  }
}
