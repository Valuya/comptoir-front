/**
 * Created by cghislai on 28/08/15.
 */

import {Component, Output} from "angular2/core";
import {NgIf} from "angular2/common";
import {Router, RouteParams, Location, CanReuse, OnActivate} from "angular2/router";
import {ErrorService} from "../../../services/error";
import {SaleService} from "../../../services/sale";
import {AuthService} from "../../../services/auth";
import {ActiveSaleService} from "../../../services/activeSale";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {Stock} from "../../../domain/stock/stock";
import {ItemVariantSelectComponent} from "../../../components/itemVariant/select/itemVariantSelect";
import {StockService} from "../../../services/stock";
import {SaleDetailsComponent} from "../../../components/sale/details/saleDetails";
import {WsStockSearch} from "../../../client/domain/search/stockSearch";

@Component({
    bindings: [ActiveSaleService],
    templateUrl: './routes/sales/details/detailsView.html',
    styleUrls: ['./routes/sales/details/detailsView.css'],
    directives: [ItemVariantSelectComponent, SaleDetailsComponent, NgIf]
})

export class SaleDetailsView implements CanReuse, OnActivate {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;
    authService:AuthService;
    saleService:SaleService;

    routeParams:RouteParams;
    router:Router;
    location:Location;

    language:string;

    stockRequest:SearchRequest<Stock>;
    stockResult:SearchResult<Stock>;
    private stockService:StockService;

    constructor(activeSaleService:ActiveSaleService, errorService:ErrorService,
                authService:AuthService, saleService:SaleService,
                stockService:StockService,
                routeParams:RouteParams, router:Router, location:Location) {
        this.activeSaleService = activeSaleService;
        this.authService = authService;
        this.errorService = errorService;
        this.saleService = saleService;
        this.stockService = stockService;

        this.routeParams = routeParams;
        this.router = router;
        this.location = location;

        this.stockRequest = new SearchRequest<Stock>();
        var search = new WsStockSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        search.active = true;
        this.stockRequest.search = search;
        this.stockResult = new SearchResult<Stock>();
    }

    routerOnActivate() {
        this.searchStocks();
        return this.findSale()
            .then((sale)=> {
                this.activeSaleService.sale = sale;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    routerCanReuse() {
        return false;
        //return this.navigatingWithinSale;
    }

    get saleClosed():boolean {
        if (this.activeSaleService == null) {
            return false;
        }
        var sale = this.activeSaleService.sale;
        var closed:boolean = sale != null && sale.closed === true;
        return closed;
    }

    onSaleEmptied() {
        this.activeSaleService.doCancelSale()
            .then(()=> {
                this.router.navigate(['/Sales/Sale', {id: 'new'}]);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaleClosed() {
    }

    onSaleReopened() {
    }

    onSaleEditAction() {
        this.router.navigate(['/Sales/Sale', {id: this.activeSaleService.sale.id}])
    }


    private findSale():Promise<any> {
        if (this.routeParams != null && this.routeParams.params != null) {
            var idParam = this.routeParams.get('id');
            var id = parseInt(idParam);
            if (isNaN(id)) {
                this.router.navigate(['/Sales/Sale', {id: 'new'}])
            }
            return this.activeSaleService.getSale(id);
        } else {
            return this.activeSaleService.getNewSale();
        }
    }

    private searchStocks() {
        this.stockService.search(this.stockRequest)
            .then((result)=> {
                this.stockResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}