/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy, Output, Input} from "angular2/core";
import * as Immutable from "immutable";
import {ActiveSaleService} from "../../../../services/activeSale";
import {ErrorService} from "../../../../services/error";
import {ItemVariantSaleColumn, ItemVariantSaleList} from "../../../itemVariantSale/list/itemVariantSaleList";
import {LocalStock} from "../../../../client/localDomain/stock";
import {LocalItemVariantSale} from "../../../../client/localDomain/itemVariantSale";

// The component
@Component({
    selector: 'choose-stock-view',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sales/sale/chooseStocksView/chooseStocksView.html',
    styleUrls: ['./components/sales/sale/chooseStocksView/chooseStocksView.css'],
    directives: [ItemVariantSaleList]
})
export class ChooseStocksView {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    @Input()
    stockList:Immutable.List<LocalStock>;

    @Output()
    validated = new EventEmitter();

    variantSaleColumns:Immutable.List<ItemVariantSaleColumn>;
    editableColumns:Immutable.List<ItemVariantSaleColumn>;

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;

        this.variantSaleColumns = Immutable.List([
            ItemVariantSaleColumn.VARIANT_REF,
            ItemVariantSaleColumn.VARIANT_NAME_COMMENT,
            ItemVariantSaleColumn.QUANTITY,
            ItemVariantSaleColumn.STOCK
        ]);
        this.editableColumns = Immutable.List([
            ItemVariantSaleColumn.STOCK
        ]);
    }

    onVariantUpdated(variant:LocalItemVariantSale) {
        this.activeSaleService.doUpdateItem(variant)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doValidate() {
        this.activeSaleService.doCloseSale()
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.validated.emit(true);
    }

}
