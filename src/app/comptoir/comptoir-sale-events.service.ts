import {Injectable} from '@angular/core';
import {
  InlineResponse200,
  InlineResponse200EventTypeEnum,
  WsAccountingEntry, WsAccountingEntryRef, WsAttributeDefinitionSearchResultList,
  WsItemVariantSale,
  WsSale,
  WsSaleRef
} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApiService} from '../api.service';
import {SearchResult} from '../app-shell/shell-table/search-result';

type SomeSaleEvent = InlineResponse200 & any;

export interface SaleItemupdateEvent {
  results: SearchResult<WsItemVariantSale>;
  saleRef: WsSaleRef;
}

export interface SaleAccountingEntriesUpdateEvent {
  results: SearchResult<WsAccountingEntry>;
  saleRef: WsSaleRef;
  transactionRef: WsAttributeDefinitionSearchResultList;
}

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleEventsService {

  private eventSource: EventSource;
  private curSubscriptionRef: WsSaleRef | null;

  private saleUpdates$ = new Subject<WsSale>();
  private saleTotalPaid$ = new Subject<number>();
  private saleItemsUpdates$ = new Subject<SaleItemupdateEvent>();
  private salePaymentEntries$ = new Subject<SaleAccountingEntriesUpdateEvent>();
  private enabled$ = new BehaviorSubject<boolean>(true);

  constructor(
    private apiService: ApiService
  ) {
  }

  subscribeToSale(ref: WsSaleRef) {
    if (ref == null) {
      this.unsubscribe();
      return;
    }
    if (this.isSubscribed(ref.id)) {
      return;
    }
    if (this.isSubscribed()) {
      this.unsubscribe();
    }
    this.subscribeToSaleRef(ref);

  }

  getUpdates$(): Observable<WsSale> {
    return this.saleUpdates$;
  }

  getItemsUpdates$(): Observable<SaleItemupdateEvent> {
    return this.saleItemsUpdates$;
  }

  getPaymentEntriesUpdates(): Observable<SaleAccountingEntriesUpdateEvent> {
    return this.salePaymentEntries$;
  }

  getSaleTotalPaidUpdates$(): Observable<number> {
    return this.saleTotalPaid$;
  }

  getEnabled$(): Observable<boolean> {
    return this.enabled$;
  }

  unsubscribe() {
    if (this.eventSource != null) {
      this.eventSource.close();
      this.curSubscriptionRef = null;
    }
  }

  private subscribeToSaleRef(ref) {
    const authToken = this.apiService.getAccessTokenQueryParam();
    const apiUrl = this.apiService.getApiUrl();
    const url = `${apiUrl}/sale/${ref.id}/events?ngsw-bypass=true&oauth2_token=${authToken}`;
    this.eventSource = new EventSource(url, {
      withCredentials: true,
    });
    this.curSubscriptionRef = ref;

    this.eventSource.addEventListener(InlineResponse200EventTypeEnum.UPDATE, m => this.onSaleUpdateMessage(m));
    this.eventSource.addEventListener(InlineResponse200EventTypeEnum.ITEMS, m => this.onSaleItemsUpdateMessage(m));
    this.eventSource.addEventListener(InlineResponse200EventTypeEnum.PAYMENTENTRIES, m => this.onSalePaymentEntriesMessage(m));
    this.eventSource.addEventListener('error', e => this.onMessageError(e));
  }

  private onSaleUpdateMessage(messageEvent) {
    const compoirEvent: SomeSaleEvent = this.parseMessage(messageEvent);
    this.saleUpdates$.next(compoirEvent.wsSale);
    this.saleTotalPaid$.next(compoirEvent.totalPaid)
  }

  private onSaleItemsUpdateMessage(messageEvent) {
    const compoirEvent: SomeSaleEvent = this.parseMessage(messageEvent);
    const searchResults: SearchResult<WsItemVariantSale> = {
      list: compoirEvent.firstPage,
      totalCount: compoirEvent.totalCount
    };
    this.saleItemsUpdates$.next({
      results: searchResults,
      saleRef: compoirEvent.saleRef
    });
  }

  private onSalePaymentEntriesMessage(messageEvent) {
    const compoirEvent: SomeSaleEvent = this.parseMessage(messageEvent);
    const searchResults: SearchResult<WsAccountingEntry> = {
      list: compoirEvent.firstPage,
      totalCount: compoirEvent.totalCount
    };
    const eventValue = {
      results: searchResults,
      saleRef: compoirEvent.saleRef,
      transactionRef: compoirEvent.accountingTransactionRef
    };
    this.salePaymentEntries$.next(eventValue);
  }

  private parseMessage(messageEvent: MessageEvent): SomeSaleEvent {
    const eventData = JSON.parse(messageEvent.data);
    return eventData as SomeSaleEvent;
  }

  private isSubscribed(id?: number) {
    if (this.curSubscriptionRef != null) {
      if (id == null) {
        return true;
      } else {
        return this.curSubscriptionRef.id === id;
      }
    } else {
      return false;
    }
  }

  private onMessageError(e: Event) {
    const eventSource: EventSource = e.target as EventSource;
    if (eventSource !== this.eventSource) {
      return;
    }
    if (eventSource.readyState === 0) {
      // Connecting, ignore
      return;
    }
    if (eventSource.readyState === 2) {
      // Closed
      this.unsubscribe();
    }
  }
}
