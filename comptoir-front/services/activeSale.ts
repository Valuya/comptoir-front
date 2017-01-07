/**
 * Created by cghislai on 22/09/15.
 */

import {Injectable} from "angular2/core";
import {WsSaleRef} from "../client/domain/commercial/sale";
import {WsPos, WsPosRef} from "../client/domain/commercial/pos";
import {Account} from "../domain/accounting/account";
import {AccountingEntry} from "../domain/accounting/accountingEntry";
import {Sale, SaleFactory} from "../domain/commercial/sale";
import {ItemVariant, ItemVariantFactory} from "../domain/commercial/itemVariant";
import {ItemVariantSale, ItemVariantSaleFactory} from "../domain/commercial/itemVariantSale";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {LocaleTextsFactory} from "../client/utils/lang";
import {AuthService} from "./auth";
import {AccountService} from "./account";
import {AccountingEntryService} from "./accountingEntry";
import {SaleService} from "./sale";
import {ItemVariantSaleService} from "./itemVariantSale";
import {StockService} from "./stock";
import {Customer} from "../domain/thirdparty/customer";
import {WsAccountingEntrySearch} from "../client/domain/search/accountingEntrySearch";
import {WsAccountSearch} from "../client/domain/search/accountSearch";
import {ItemVariantSaleSearch} from "../client/domain/search/itemVariantSaleSearch";

@Injectable()
export class ActiveSaleService {
    sale:Sale;
    saleItemsRequest:SearchRequest<ItemVariantSale>;
    saleItemsResult:SearchResult<ItemVariantSale>;
    pos:WsPos;
    accountingEntriesRequest:SearchRequest<AccountingEntry>;
    accountingEntriesResult:SearchResult<AccountingEntry>;
    accountsRequest:SearchRequest<Account>;
    accountsResult:SearchResult<Account>;
    paidAmount:number;


    authService:AuthService;
    accountService:AccountService;
    accountingEntryService:AccountingEntryService;
    saleService:SaleService;
    stockService:StockService;
    itemVariantSaleService:ItemVariantSaleService;

    constructor(authService:AuthService,
                accountService:AccountService,
                stockService:StockService,
                accountingEntryService:AccountingEntryService,
                saleService:SaleService,
                itemVariantSaleService:ItemVariantSaleService) {
        this.stockService = stockService;
        this.sale = null;
        this.pos = null;

        this.saleItemsRequest = new SearchRequest<ItemVariantSale>();
        var itemVariantSaleSearch = new ItemVariantSaleSearch();
        itemVariantSaleSearch.companyRef = authService.getEmployeeCompanyRef();
        this.saleItemsRequest.search = itemVariantSaleSearch;
        this.saleItemsResult = new SearchResult<ItemVariantSale>();

        this.accountingEntriesRequest = new SearchRequest<AccountingEntry>();
        var accountingEntrySearch = new WsAccountingEntrySearch();
        accountingEntrySearch.companyRef = authService.getEmployeeCompanyRef();
        this.accountingEntriesRequest.search = accountingEntrySearch;
        this.accountingEntriesResult = new SearchResult<AccountingEntry>();

        this.accountsRequest = new SearchRequest<Account>();
        var accountSearch = new WsAccountSearch();
        accountSearch.companyRef = authService.getEmployeeCompanyRef();
        this.accountsRequest.search = accountSearch;
        this.accountsResult = new SearchResult<Account>();

        this.authService = authService;
        this.accountService = accountService;
        this.accountingEntryService = accountingEntryService;
        this.saleService = saleService;
        this.itemVariantSaleService = itemVariantSaleService;
    }

    public getSale(id:number):Promise<Sale> {
        return this.saleService.get(id)
            .then((sale)=> {
                if (sale == null) {
                    return this.getNewSale();
                }
                return sale;
            })
            .then((sale:Sale) => {
                this.sale = sale;
                var taskList:Promise<any>[] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries(),
                    this.doSearchSaleItems()
                ];
                return Promise.all(taskList);
            })
            .then(()=> {
                return this.sale;
            });
    }

    public getNewSale():Promise<Sale> {
        var newSale = SaleFactory.createNewSale({
            company: this.authService.getEmployeeCompany(),
            discountRatio: 0
        });
        return Promise.resolve(newSale)
            .then((sale)=> {
                this.sale = sale;
                this.paidAmount = 0;
                this.accountingEntriesResult = new SearchResult<AccountingEntry>();
                this.saleItemsResult.count = 0;
                this.saleItemsResult.list = Immutable.List([]);
                return sale;
            });
    }

    public doCancelSale():Promise<any> {
        return this.saleService.remove(this.sale.id).then(()=> {
            this.sale = null;
        });
    }

    public doSaveSale():Promise<Sale> {
        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.get(ref.id);
            }).then((sale:Sale)=> {
                this.sale = sale;
                return sale;
            });
    }


    public doCloseSale() {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var authToken = this.authService.authToken;
        return this.saleService.closeSale(this.sale.id, authToken)
            .then((ref)=>{
                return this.saleService.fetch(ref.id);
            })
            .then((sale)=>{
                this.sale = sale;
                return this.doSearchSaleItems();
            })
            .then(()=>{
                return this.sale;
            });
    }

    public doReopensale():Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var authToken = this.authService.authToken;
        this.sale = <Sale>this.sale.set('closed', false);
        return this.saleService.reopenSale(this.sale.id)
            .then((ref)=> {
                return this.saleService.fetch(ref.id);
            })
            .then((sale)=>{
                this.sale = sale;
                return sale;
            });
    }

    public fetchSaleAndItem(item:ItemVariantSale):Promise<any[]> {
        var taskList:Promise<any>[] = <Promise<any>[]>[
            this.saleService.fetch(this.sale.id).then((sale)=> {
                this.sale = sale;
            }),
            this.itemVariantSaleService.fetch(item.id)
                .then((fetchedItem)=> {
                    if (item.id != null) {
                        return this.updateSaleItem(fetchedItem);
                    } else {
                        return this.doSearchSaleItems();
                    }
                })
        ];
        return Promise.all(taskList);
    }

    public doAddItem(itemVariant:ItemVariant):Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }

        var item = itemVariant.item;
        var multipleSale = item.multipleSale;

        var itemSale:ItemVariantSale;
        if (!multipleSale) {
            itemSale = this.saleItemsResult.list.find((itemSale)=> {
                return itemSale.itemVariant.id === itemVariant.id;
            });
        }

        if (itemSale == null || multipleSale) {
            var itemSaleDesc:any = {
                comment: LocaleTextsFactory.toLocaleTexts({}),
                discountRatio: 0,
                itemVariant: itemVariant,
                quantity: 1,
                sale: this.sale,
                vatExclusive: ItemVariantFactory.calcPrice(itemVariant, false),
                vatRate: itemVariant.item.vatRate
            };
            itemSale = ItemVariantSaleFactory.createNewItemVariantSale(itemSaleDesc);
        } else {
            var oldQuantity = itemSale.quantity;
            var newQuantity = oldQuantity + 1;
            var itemSale = <ItemVariantSale>itemSale.set('quantity', newQuantity);
            this.updateSaleItem(itemSale);
        }
        return this.itemVariantSaleService.save(itemSale)
            .then((ref)=> {
                var newItemSale = <ItemVariantSale>itemSale.set('id', ref.id);
                if (multipleSale) {
                    if (this.saleItemsResult != null) {
                        this.saleItemsResult.list = this.saleItemsResult.list.push(newItemSale);
                        this.saleItemsResult.count++;
                    }
                }
                return this.fetchSaleAndItem(newItemSale);
            });
    }

    public doRemoveItem(saleItem:ItemVariantSale):Promise<any> {
        var newItems = this.saleItemsResult.list.filter((item)=> {
            return item !== saleItem;
        }).toList();
        this.saleItemsResult.list = newItems;

        return this.itemVariantSaleService.remove(saleItem.id)
            .then(()=> {
                var taskList:Promise<any>[] = [
                    this.saleService.fetch(this.sale.id).then((sale)=> {
                        this.sale = sale;
                    }),
                    this.doSearchSaleItems()
                ];
                return Promise.all(taskList);
            })
            .then(()=> {
                return this.getSaleTotalAmount();
            })
    }

    public doUpdateItem(saleItem:ItemVariantSale):Promise<any> {
        return this.itemVariantSaleService.save(saleItem)
            .then((ref)=> {
                saleItem = <ItemVariantSale>saleItem.set('id', ref.id);
                return this.fetchSaleAndItem(saleItem);
            });
    }

    public doSetSaleDiscountRatio(ratio:number):Promise<any> {
        var newSale = <Sale>this.sale.set('discountRatio', ratio);
        this.sale = newSale;
        return this.doUpdateSale();
    }


    public doSearchSaleItems():Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var search = this.saleItemsRequest.search;
        var saleRef = new WsSaleRef(this.sale.id);
        search.saleRef = saleRef;
        return this.itemVariantSaleService.search(this.saleItemsRequest)
            .then((result)=> {
                this.saleItemsResult.list = result.list;
                this.saleItemsResult.count = result.count;
            });
    }

    public searchPaidAmount():Promise<any> {
        if (this.sale == null || this.sale.id == null) {
            throw 'No saved sale';
        }
        return this.saleService.getTotalPayed(this.sale.id, this.authService.authToken)
            .then((paid:number)=> {
                this.paidAmount = paid;
                return paid;
            });
    }

    public setPos(pos:WsPos):Promise<any> {
        this.pos = pos;
        return Promise.all([
            this.searchAccounts(),
        ]);
    }

    public searchAccounts():Promise<any> {
        var search = this.accountsRequest.search;
        var posRef = new WsPosRef(this.pos.id);
        search.posRef = posRef;
        return this.accountService.search(this.accountsRequest)
            .then((result)=> {
                this.accountsResult = result;
            });
    }

    public searchAccountingEntries():Promise<any> {
        var search = this.accountingEntriesRequest.search;
        search.accountingTransactionRef = this.sale.accountingTransactionRef;
        return this.accountingEntryService.search(this.accountingEntriesRequest)
            .then((result)=> {
                this.accountingEntriesResult = result;
            });
    }

    public doAddAccountingEntry(entry:AccountingEntry):Promise<any> {
        this.accountingEntriesResult.list.push(entry);
        this.accountingEntriesResult.count++;

        return this.accountingEntryService.save(entry)
            .then(()=> {
                var taskLlist:Promise<any> [] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries()
                ];
                return Promise.all(taskLlist);
            });

    }

    public doRemoveAccountingEntry(entry:AccountingEntry):Promise<any> {
        return this.accountingEntryService.remove(entry.id)
            .then(()=> {
                var taskLlist:Promise<any> [] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries()
                ];
                return Promise.all(taskLlist);
            });

    }


    public getSaleTotalAmount() {
        if (this.sale == null) {
            return 0;
        }
        var total = this.sale.vatExclusiveAmount + this.sale.vatAmount;
        return total;
    }

    public doSetSaleReference(reference:string):Promise<any> {
        var newSale = <Sale>this.sale.set('reference', reference);
        this.sale = newSale;
        if (this.sale.id == null) {
            // New sale;
            return Promise.resolve(this.sale);
        }
        return this.doUpdateSale();
    }


    public doSetSaleCustomer(customer: Customer):Promise<any> {
        var newSale = <Sale>this.sale.set('customer', customer);
        this.sale = newSale;
        if (this.sale.id == null) {
            // New sale;
            return Promise.resolve(this.sale);
        }
        return this.doUpdateSale();
    }


    public doSetSaleDateTime(dateTime:Date):Promise<any> {
        var newSale = <Sale>this.sale.set('dateTime', dateTime);
        this.sale = newSale;
        if (this.sale.id == null) {
            // New sale;
            return Promise.resolve(this.sale);
        }
        return this.doUpdateSale();
    }

    private updateSaleItem(fetchedItem:ItemVariantSale) {
        var listIndex = this.saleItemsResult.list.findIndex((item)=> {
            return item.id === fetchedItem.id;
        });
        if (listIndex < 0) {
            var mutipleSale = fetchedItem.itemVariant.item.multipleSale;
            if (!mutipleSale) {
                listIndex = this.saleItemsResult.list.findIndex((item)=> {
                    return item.itemVariant.id === fetchedItem.itemVariant.id;
                });
            }
        }
        if (listIndex < 0) {
            console.warn("Cannot find sale item to update");
            return this.doSearchSaleItems();
        }
        this.saleItemsResult.list = this.saleItemsResult.list.set(listIndex, fetchedItem);
    }

    private doUpdateSale():Promise<any> {
        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.fetch(ref.id);
            })
            .then((sale:Sale)=> {
                this.sale = sale;
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}
