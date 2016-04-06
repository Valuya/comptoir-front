import {ChangeDetectionStrategy, EventEmitter, Component, Input, Output} from "angular2/core";
import {FastInputDirective} from "../../../utils/fastInput";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import {ActiveSaleService} from "../../../../services/activeSale";
import {ErrorService} from "../../../../services/error";
import {Sale} from "../../../../domain/commercial/sale";
import {NumberUtils} from "../../../../client/utils/number";
/**
 * Created by cghislai on 06/04/16.
 */

@Component({
    selector: 'commandview-header',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sale/commandView/header/commandViewHeader.html',
    styleUrls: ['./components/sale/commandView/header/commandViewHeader.css'],
    directives: [FastInputDirective, NgIf, FORM_DIRECTIVES]
})
export class CommandViewHeaderComponent {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    @Input()
    validated:boolean = false;
    @Input()
    noInput:boolean = false;
    @Output()
    validateChanged = new EventEmitter();

    editingSaleDiscount:boolean = false;

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
    }

    get isNewSale():boolean {
        var sale = this.activeSaleService.sale;
        return sale != null && sale.id == null;
    }

    get sale():Sale {
        return this.activeSaleService.sale;
    }

    get isSearching():boolean {
        var request = this.activeSaleService.saleItemsRequest;
        return request != null && request.busy;
    }

    get hasItems():boolean {
        var result = this.activeSaleService.saleItemsResult;
        return result != null && result.count > 0;
    }

    doEditSaleDiscount() {
        this.editingSaleDiscount = true;
    }

    validateDiscount(value:string) {
        if (value.length > 0) {
            var intValue = parseInt(value);
            if (isNaN(intValue)) {
                return false;
            }
            return intValue >= 0 && intValue <= 100;
        }
        return true;
    }

    onSaleDiscountChange(newValue:string) {
        this.editingSaleDiscount = false;

        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = null;
        }
        if (discountPercentage != null) {
            var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
            this.activeSaleService.doSetSaleDiscountRatio(discountRatio)
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        } else {
            this.activeSaleService.doSetSaleDiscountRatio(null)
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
    }

    doValidate() {
        this.validateChanged.emit(true);
    }

    doUnvalidate() {
        this.validateChanged.emit(false);
    }

}
