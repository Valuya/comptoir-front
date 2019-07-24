import {Injectable} from '@angular/core';
import {BehaviorSubject, concat, forkJoin, Observable, of, Subject} from 'rxjs';
import {
  WsCompany,
  WsCompanyRef, WsCustomerRef,
  WsItemVariantRef,
  WsItemVariantSale,
  WsItemVariantSaleRef,
  WsItemVariantSaleSearch,
  WsItemVariantSaleSearchResult, WsPosRef,
  WsSale
} from '@valuya/comptoir-ws-api';
import {defaultIfEmpty, filter, map, publishReplay, refCount, scan, switchMap, take, tap, throwIfEmpty} from 'rxjs/operators';
import {ShellTableHelper} from '../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../util/pagination';
import {ApiService} from '../api.service';
import {AuthService} from '../auth.service';
import {PaginationUtils} from '../util/pagination-utils';
import {SearchResult} from '../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../app-shell/shell-table/search-result.factory';
import {SaleService} from '../domain/commercial/sale.service';
import {ItemService} from '../domain/commercial/item.service';
import {LocaleService} from '../locale.service';
import {WsLocaleText} from '../domain/lang/locale-text/ws-locale-text';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ComptoirService {

  pointOfSaleRef$ = new BehaviorSubject<WsPosRef | null>(null);
  defaultCustomerRef$ = new BehaviorSubject<WsCustomerRef | null>(null);

  customerLoyaltyAmount$: Observable<number>;
  customerLoyaltyAmountReloadTrigger$ = new Subject<any>();

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private messageService: MessageService,
  ) {
    this.customerLoyaltyAmount$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(
      switchMap(ref => this.reemitOnReload$(ref, this.customerLoyaltyAmountReloadTrigger$)),
      switchMap(ref => this.fetchCompany$(ref)),
      map(c => c.customerLoyaltyRate),
      publishReplay(1), refCount()
    );
  }

  setPos(posRef: WsPosRef) {
    this.pointOfSaleRef$.next(posRef);
  }

  setDefaultCustomer(customerRef: WsCustomerRef) {
    this.defaultCustomerRef$.next(customerRef);
  }

  setCustomerLoyaltyRate(rate: number) {
    this.authService.getLoggedEmployeeCompanyRef$().pipe(
      switchMap(ref => this.fetchCompany$(ref)),
      map(c => Object.assign({}, c, {
        customerLoyaltyRate: rate
      } as Partial<WsCompany>) as WsCompany),
      switchMap(company => this.updateCompany$(company))
    ).subscribe(
      ref => this.onLoyaltyRateUpdated(),
      e => this.showUpdateError(e),
    );
  }

  private onLoyaltyRateUpdated() {
    this.messageService.add({
      severity: 'info',
      summary: `Loyalty rate updated`,
    });
    this.customerLoyaltyAmountReloadTrigger$.next(true);
  }

  private fetchCompany$(ref: WsCompanyRef) {
    return this.apiService.api.getCompany({
      id: ref.id
    }) as any as Observable<WsCompany>;
  }

  private updateCompany$(company: WsCompany) {
    return this.apiService.api.updateCompany({
      id: company.id,
      wsCompany: company
    }) as any as Observable<WsCompanyRef>;
  }

  private reemitOnReload$(ref: WsCompanyRef, subject: Subject<any>): Observable<WsCompanyRef> {
    return concat(
      of(ref),
      subject
    ).pipe(
      map(() => ref)
    );
  }

  private showUpdateError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: `Failed to submit update`,
      detail: `${error}`
    });
  }
}
