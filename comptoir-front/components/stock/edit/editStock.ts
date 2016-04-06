/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit} from 'angular2/core';
import {NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/common';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {ErrorService} from '../../../services/error';

import {LangSelectComponent} from '../../lang/langSelect/langSelect';
import {LocalizedInputDirective} from '../../lang/localizedInput/localizedInput';
import {RequiredValidator} from '../../utils/validators';
import {FormMessageComponent} from '../../utils/formMessage/formMessage';
import {StockService} from "../../../services/stock";
import {Stock} from "../../../domain/stock/stock";
import {WsStockRef} from "../../../client/domain/stock/stock";


@Component({
    selector: 'stock-edit',
    inputs: ['stock'],
    outputs: ['saved', 'cancelled'],
    templateUrl: './components/stock/edit/editStock.html',
    styleUrls: ['./components/stock/edit/editStock.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelectComponent, LocalizedInputDirective,
        RequiredValidator, FormMessageComponent]
})
export class StockEditComponent implements OnInit {
    stockService:StockService;
    errorService:ErrorService;
    authService:AuthService;

    stock:Stock;
    stockModel:any;

    editLanguage:Language;
    appLanguage:Language;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(stockService:StockService, authService:AuthService, errorService:ErrorService) {
        this.stockService = stockService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
    }

    ngOnInit() {
        this.stockModel = this.stock.toJS();
    }


    onFormSubmit() {
        this.saveStock(this.stock)
            .then((stock)=> {
                this.saved.emit(stock);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.emit(null);
    }


    private saveStock(stock:Stock):Promise<Stock> {
        return this.stockService.save(stock)
            .then((ref:WsStockRef)=> {
                return this.stockService.get(ref.id);
            })
            .then((stock:Stock)=> {
                this.stock = stock;
                this.stockModel = stock.toJS();
                return stock;
            });
    }

}
