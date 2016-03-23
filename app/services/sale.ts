/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {Http, Request} from "angular2/http";
import {Sale, SaleRef} from "../client/domain/sale";
import {CompanyRef} from "../client/domain/company";
import {CustomerRef} from "../client/domain/customer";
import {LocalSale, LocalSaleFactory} from "../client/localDomain/sale";
import {LocalSalePrice, LocalSalePriceFactory} from "../client/localDomain/salePrice";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {WsUtils} from "../client/utils/wsClient";
import {JSONFactory} from "../client/utils/factory";
import {SaleClient} from "../client/sale";
import {AuthService} from "./auth";
import {AccountingTransactionService} from "./accountingTransaction";
import {CompanyService} from "./company";
import {CustomerService} from "./customer";

@Injectable()
export class SaleService {
    private saleClient:SaleClient;
    private authService:AuthService;
    private accountingTransactionService:AccountingTransactionService;
    private companyService:CompanyService;
    private customerService:CustomerService;
    private http:Http;


    constructor(saleClient:SaleClient,
                authService:AuthService,
                accountingTransactionService:AccountingTransactionService,
                companyService:CompanyService,
                customerService:CustomerService,
                http:Http) {
        this.saleClient = saleClient;
        this.authService = authService;
        this.accountingTransactionService = accountingTransactionService;
        this.companyService = companyService;
        this.customerService = customerService;
        this.http = http;

    }

    fetch(id:number):Promise<LocalSale> {
        return this.saleClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:Sale)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<LocalSale> {
        return this.saleClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Sale)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.saleClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalSale):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.saleClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalSale>):Promise<SearchResult<LocalSale>> {
        return this.saleClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Sale>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalSale>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }


    closeSale(id:number, authToken:string):Promise<SaleRef> {
        var url = this.saleClient.webServiceUrl + this.saleClient.resourcePath + '/' + id + '/state/CLOSED';
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.method = 'PUT';
        options.url = url;
        var request = this.http.request(new Request(options));

        return request
            .map(response=> {
                var saleRef = <SaleRef>response.json();
                this.saleClient.doClear(saleRef.id);
                return saleRef;
            })
            .toPromise();
    }

    reopenSale(id:number):Promise<SaleRef> {
        var url = this.saleClient.webServiceUrl + this.saleClient.resourcePath + '/' + id + '/state/OPEN';
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.method = 'PUT';
        options.url = url;
        var request = this.http.request(new Request(options));

        return request
            .map(response=> {
                var saleRef = <SaleRef>response.json();
                this.saleClient.doClear(saleRef.id);
                return saleRef;
            })
            .toPromise();
    }

    getTotalPayed(id:number, authToken:string):Promise<number> {
        var url = this.saleClient.webServiceUrl + this.saleClient.resourcePath + '/' + id + '/payed';
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.method = 'GET';
        options.url = url;
        var request = this.http.request(new Request(options));

        return request
            .map(response=>response.json())
            .map((value:any)=> {
                var payed:number = parseFloat(value.value);
                return payed;
            })
            .toPromise();
    }
    
    getSalesTotalPayed(searchRequest:SearchRequest<LocalSale>):Promise<LocalSalePrice> {
        var url = this.saleClient.webServiceUrl + this.saleClient.resourcePath + '/searchTotalPayed';
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.method = 'POST';
        options.url = url;
        options.body = JSON.stringify(searchRequest.search, JSONFactory.toJSONReplacer);
        var request = this.http.request(new Request(options));

        return request
            .map(response=>response.json())
            .map(value=> {
                var salePrice = LocalSalePriceFactory.createNewSalePrice(value);
                return salePrice;
            })
            .toPromise();
    }

    toLocalConverter(sale:Sale):Promise<LocalSale> {
        var localSaleDesc:any = {};
        localSaleDesc.id = sale.id;
        localSaleDesc.closed = sale.closed;
        localSaleDesc.dateTime = sale.dateTime;
        localSaleDesc.discountAmount = sale.discountAmount;
        localSaleDesc.discountRatio = sale.discountRatio;
        localSaleDesc.invoiceRef = sale.invoiceRef;
        localSaleDesc.reference = sale.reference;
        localSaleDesc.vatAmount = sale.vatAmount;
        localSaleDesc.vatExclusiveAmount = sale.vatExclusiveAmount;
        localSaleDesc.accountingTransactionRef = sale.accountingTransactionRef;
        var taskList = [];

        // FIXME: implement in backend
        /*
         var accountingTransactionRef = sale.accountingTransactionRef;
         if (accountingTransactionRef != null) {
         taskList.push(
         this.accountingTransactionService.get(accountingTransactionRef.id)
         .then((accountingEntry)=> {
         localSaleDesc.accountingTransaction = accountingEntry;
         })
         );
         }
         */
        var companyRef = sale.companyRef;
        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany) => {
                    localSaleDesc.company = localCompany;
                })
        );
        var customerRef = sale.customerRef;
        if (customerRef != null) {
            taskList.push(
                this.customerService.get(customerRef.id)
                    .then((customer)=> {
                        localSaleDesc.customer = customer;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return LocalSaleFactory.createNewSale(localSaleDesc);
            });
    }

    fromLocalConverter(localSale:LocalSale):Sale {
        var sale = new Sale();
        sale.id = localSale.id;
        sale.accountingTransactionRef = localSale.accountingTransactionRef;
        /*if (localSale.accountingTransaction != null) {
         sale.accountingTransactionRef = new AccountingTransactionRef(localSale.accountingTransaction.id);
         }*/
        sale.closed = localSale.closed;
        if (localSale.company != null) {
            sale.companyRef = new CompanyRef(localSale.company.id);
        }
        if (localSale.customer != null) {
            sale.customerRef = new CustomerRef(localSale.customer.id);
        }
        sale.dateTime = localSale.dateTime;
        sale.discountAmount = localSale.discountAmount;
        sale.discountRatio = localSale.discountRatio;
        sale.invoiceRef = localSale.invoiceRef;
        sale.reference = localSale.reference;
        sale.vatAmount = localSale.vatAmount;
        sale.vatExclusiveAmount = localSale.vatExclusiveAmount;
        return sale;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}