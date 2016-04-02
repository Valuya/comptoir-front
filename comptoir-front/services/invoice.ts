/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsInvoice} from "../client/domain/commercial/invoice";
import {WsCompanyRef} from "../client/domain/company/company";
import {WsSaleRef} from "../client/domain/commercial/sale";
import {Invoice, InvoiceFactory} from "../domain/commercial/invoice";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {InvoiceClient} from "../client/client/invoice";
import {AuthService} from "./auth";
import {CompanyService} from "./company";
import {SaleService} from "./sale";

@Injectable()
export class InvoiceService {

    invoiceClient:InvoiceClient;
    authService:AuthService;
    companyService:CompanyService;
    saleService:SaleService;

    constructor(invoiceClient:InvoiceClient,
                authService:AuthService,
                companyService:CompanyService,
                saleService:SaleService) {
        this.invoiceClient = invoiceClient;
        this.authService = authService;
        this.companyService = companyService;
        this.saleService = saleService;
    }

    get(id:number):Promise<Invoice> {
        return this.invoiceClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsInvoice)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.invoiceClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:Invoice):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.invoiceClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<Invoice>):Promise<SearchResult<Invoice>> {
        return this.invoiceClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsInvoice>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<Invoice>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(invoice:WsInvoice):Promise<Invoice> {
        var localInvoiceDesc:any = {};
        localInvoiceDesc.id = invoice.id;
        localInvoiceDesc.note = invoice.note;
        localInvoiceDesc.number = invoice.number;

        var taskList = [];

        var companyRef = invoice.companyRef;
        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany)=> {
                    localInvoiceDesc.company = localCompany;
                })
        );

        var saleRef = invoice.saleRef;
        taskList.push(
            this.saleService.get(saleRef.id)
                .then((sale)=> {
                    localInvoiceDesc.sale = sale;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return InvoiceFactory.createNewInvoice(localInvoiceDesc);
            });
    }

    fromLocalConverter(localInvoice:Invoice):WsInvoice {
        var invoice = new WsInvoice();
        ;
        if (localInvoice.company != null) {
            invoice.companyRef = new WsCompanyRef(localInvoice.company.id);
        }
        invoice.id = localInvoice.id;
        invoice.note = localInvoice.note;
        invoice.number = localInvoice.number;
        if (localInvoice.sale != null) {
            invoice.saleRef = new WsSaleRef(localInvoice.sale.id);
        }
        return invoice;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}