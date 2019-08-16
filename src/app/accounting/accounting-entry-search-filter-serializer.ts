import {WsAccountingEntrySearch, WsAccountSearch, WsPosRef} from '@valuya/comptoir-ws-api';
import {SearchFilterQueryParams} from '../domain/util/search-filter/search-filter-query-param';
import {SearchFilterSerializer} from '../domain/util/search-filter/search-filter-serializer';
import {BalanceIdMoneyPilesAccountRef} from '@valuya/comptoir-ws-api/models/BalanceIdMoneyPilesAccountRef';

export class AccountingEntrySearchFilterSerializer {

  static serializeFilter(searchFilter: Partial<WsAccountingEntrySearch>): SearchFilterQueryParams<WsAccountingEntrySearch> {
    const queryParamsValue: SearchFilterQueryParams<WsAccountingEntrySearch> = {};

    SearchFilterSerializer.serializeQueryParam<WsAccountingEntrySearch>(
      searchFilter.fromDateTime, 'fromDateTime', queryParamsValue,
      SearchFilterSerializer.serializeDate,
    );
    SearchFilterSerializer.serializeQueryParam<WsAccountingEntrySearch>(
      searchFilter.toDateTime, 'toDateTime', queryParamsValue,
      SearchFilterSerializer.serializeDate,
    );
    SearchFilterSerializer.serializeQueryParam<WsAccountingEntrySearch>(
      searchFilter.accountingTransactionRef, 'accountingTransactionRef', queryParamsValue,
      SearchFilterSerializer.serializeRef,
    );

    const accountSearch: WsAccountSearch = searchFilter.accountSearch as any as WsAccountSearch;
    if (accountSearch != null) {
      SearchFilterSerializer.serializeQueryParam<WsAccountSearch>(
        accountSearch.cash, 'accountSearch.cash', queryParamsValue,
        SearchFilterSerializer.serializeBoolean,
      );
      SearchFilterSerializer.serializeQueryParam<WsAccountSearch>(
        accountSearch.accountType, 'accountSearch.accountType', queryParamsValue
      );
      SearchFilterSerializer.serializeQueryParam<WsAccountSearch>(
        accountSearch.posRef, 'accountSearch.posRef', queryParamsValue,
        SearchFilterSerializer.serializeRef
      );
      SearchFilterSerializer.serializeQueryParam<WsAccountSearch>(
        accountSearch.multiSearch, 'accountSearch.multiSearch', queryParamsValue,
      );
    }
    return queryParamsValue;
  }

  static deserializeFilter(queryParams: SearchFilterQueryParams<WsAccountingEntrySearch>): WsAccountingEntrySearch {
    const entrySearch: WsAccountingEntrySearch = {} as WsAccountingEntrySearch;

    entrySearch.fromDateTime = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'fromDateTime',
      SearchFilterSerializer.deserializeDate
    );
    entrySearch.toDateTime = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'toDateTime',
      SearchFilterSerializer.deserializeDate
    );
    entrySearch.accountingTransactionRef = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'accountingTransactionRef',
      SearchFilterSerializer.deserializeRef
    ) as BalanceIdMoneyPilesAccountRef;

    entrySearch.accountSearch = {};
    entrySearch.accountSearch.cash = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'accountSearch.cash',
      SearchFilterSerializer.deserializeBoolean
    );
    entrySearch.accountSearch.accountType = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'accountSearch.accountType'
    );
    entrySearch.accountSearch.posRef = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'accountSearch.posRef',
      SearchFilterSerializer.deserializeRef
    ) as WsPosRef;
    entrySearch.accountSearch.multiSearch = SearchFilterSerializer.deserializeQueryParam<WsAccountingEntrySearch>(
      queryParams, 'accountSearch.multiSearch'
    );
    return entrySearch;
  }

}
