/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalStock, LocalStockFactory} from '../../../client/localDomain/stock';

import {AuthService} from '../../../services/auth';
import {StockService} from '../../../services/stock';
import {ErrorService} from '../../../services/error';

import {LocaleTexts} from '../../../client/utils/lang';
import {StockEditComponent} from '../../../components/stock/edit/editStock';

@Component({
    selector: 'edit-stock',
    templateUrl: './routes/stock/edit/editView.html',
    styleUrls: ['./routes/stock/edit/editView.css'],
    directives: [NgIf, RouterLink, StockEditComponent]
})
export class EditStockView {
    stockService:StockService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    stock:LocalStock;


    constructor(stockService:StockService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.stockService = stockService;
        this.authService = authService;
        this.errorService = appService;

        this.findStock(routeParams);
    }

    findStock(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewStock();
            return;
        }
        var itemIdParam = routeParams.get('id');
        var stockId = parseInt(itemIdParam);
        if (isNaN(stockId)) {
            if (itemIdParam === 'new') {
                this.getNewStock();
                return;
            }
            this.getNewStock();
            return;
        }
        this.getStock(stockId);
    }

    getNewStock() {
        var stockDesc: any = {};
        stockDesc.company = this.authService.getEmployeeCompany();
        stockDesc.description = new LocaleTexts();
        stockDesc.active = true;
        this.stock = LocalStockFactory.createNewStock(stockDesc);
    }

    getStock(id:number) {
        this.stockService.get(id)
            .then((stock)=> {
                this.stock = stock;
            });
    }

    onSaved(stock) {
        this.stockService.save(stock)
            .then(()=> {
                this.router.navigate(['/Stock/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelled() {
        this.router.navigate(['/Stock/List']);
    }

}
