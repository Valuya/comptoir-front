/**
 * Created by cghislai on 28/08/15.
 */

import {Component, ViewChild} from "angular2/core";
import {NgIf} from "angular2/common";
import {Router, RouteParams, Location, CanReuse, OnActivate} from "angular2/router";
import {Sale} from "../../../domain/commercial/sale";
import {ItemVariant} from "../../../domain/commercial/itemVariant";
import {ErrorService} from "../../../services/error";
import {SaleService} from "../../../services/sale";
import {AuthService} from "../../../services/auth";
import {ActiveSaleService} from "../../../services/activeSale";
import {CommandView} from "../../../components/sale/commandView/commandView";
import {PayView} from "../../../components/sale/payView/payView";
import {PosSelectComponent} from "../../../components/pos/posSelect/posSelect";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {Stock} from "../../../domain/stock/stock";
import {ItemVariantSelectComponent} from "../../../components/itemVariant/select/itemVariantSelect";
import {StockService} from "../../../services/stock";
import {SaleDetailsComponent} from "../../../components/sale/details/saleDetails";
import {WsStockSearch} from "../../../client/domain/search/stockSearch";

@Component({
    templateUrl: './routes/sales/sale/saleView.html',
    styleUrls: ['./routes/sales/sale/saleView.css'],
    directives: [ItemVariantSelectComponent, CommandView, PayView, SaleDetailsComponent, NgIf, PosSelectComponent]
})

export class SaleView implements CanReuse, OnActivate {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;
    authService:AuthService;
    saleService:SaleService;

    routeParams:RouteParams;
    router:Router;
    location:Location;

    navigatingWithinSale:boolean;
    payStep:boolean;

    language:string;

    @ViewChild(PayView)
    payView:PayView;

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

        this.navigatingWithinSale = false;
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
                if (sale.closed) {
                    this.router.navigate(['/Sales/Sale', {id: 'new'}]);
                    return null;
                }
                return sale;
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

    get newSale():boolean {
        if (this.activeSaleService == null) {
            return false;
        }
        var sale = this.activeSaleService.sale;
        return sale != null && sale.id == null;
    }


    onPosChanged(pos) {
        this.activeSaleService.setPos(pos)
            .then(()=> {
                if (this.payView) {
                    this.payView.fetchAccountList();
                }
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaleEmptied() {
        this.activeSaleService.doCancelSale()
            .then(()=> {
                this.router.navigate(['/Sales/Sale', {id: 'new'}]);
            }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onItemClicked(item:ItemVariant) {
        var itemList = document.getElementById('saleItemList');
        itemList.focus();

        if (this.newSale) {
            return this.activeSaleService.doSaveSale()
                .then((sale)=> {
                    this.activeSaleService.sale = sale;
                    return this.activeSaleService.doAddItem(item);
                }).then(()=> {
                    // this.navigatingWithinSale = true;
                    var saleId = this.activeSaleService.sale.id;
                    this.location.go('/sales/sale/' + saleId);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
        this.activeSaleService.doAddItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCommandPaid() {
        this.payStep = false;
        this.activeSaleService.getNewSale()
            .then(()=> {
                this.router.navigate(['/Sales/Sale', {id: 'new'}]);
            });
    }

    onSaleDetails() {
        this.payStep = false;
        this.router.navigate(['/Sales/Details', {id: this.activeSaleService.sale.id}]);
    }

    onValidateChanged(validated) {
        this.payStep = validated;
    }

    onSaleReopened() {
        this.payStep = false;
    }

    private findSale():Promise<any> {
        if (this.routeParams != null && this.routeParams.params != null) {
            var idParam = this.routeParams.get('id');
            var id = parseInt(idParam);
            if (isNaN(id)) {
                if (idParam === 'new') {
                    return this.activeSaleService.getNewSale();
                }
                if (idParam === 'active') {
                    return this.getActiveSale();
                }
                return this.getActiveSale();
            }
            return this.activeSaleService.getSale(id)
                .then((sale)=> {
                    return sale;
                }, ()=>{
                    var instruction = this.router.generate(['../Sale', {id: 'new'}]);
                    this.router.navigateByInstruction(instruction, false);
                });
        } else {
            return this.activeSaleService.getNewSale();
        }
    }

    private getActiveSale():Promise<Sale> {
        var activeSale = this.activeSaleService.sale;

        var saleTask:Promise<Sale>;
        if (activeSale != null) {
            saleTask = Promise.resolve(activeSale);
        } else {
            saleTask = this.activeSaleService.getNewSale();
        }
        return saleTask
            .then((sale)=> {
                var saleId = sale.id;
                // update url
                if (saleId == null) {
                    var instruction = this.router.generate(['../Sale', {id: 'new'}]);
                    this.router.navigateByInstruction(instruction, false);
                } else {
                    var instruction = this.router.generate(['../Sale', {id: saleId}]);
                    this.router.navigateByInstruction(instruction, false);
                }
                return sale;
            });
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
