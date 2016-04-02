/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy, Output, Input} from "angular2/core";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import * as Immutable from "immutable";
import {LocalSale} from "../../../../domain/sale";
import {LocalItemVariantSale} from "../../../../domain/itemVariantSale";
import {NumberUtils} from "../../../../client/utils/number";
import {ActiveSaleService} from "../../../../services/activeSale";
import {ErrorService} from "../../../../services/error";
import {FastInput} from "../../../utils/fastInput";
import {
    ItemVariantSaleColumn,
    ItemVariantSaleList,
    ItemVariantSaleColumnAction,
    ItemVariantSaleColumnActionEvent
} from "../../../itemVariantSale/list/itemVariantSaleList";
import {LocalCustomer} from "../../../../domain/customer";
import {CustomerSelectInputComponent} from "../../../customer/select/customerSelectInput";

@Component({
    selector: 'command-view-header',
    inputs: ['noInput', 'validated'],
    outputs: ['validateChanged'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sales/sale/commandView/header.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [FastInput, NgIf, FORM_DIRECTIVES]
})
export class CommandViewHeader {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    editingSaleDiscount:boolean = false;
    validated:boolean = false;
    validateChanged = new EventEmitter();

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
    }

    get isNewSale():boolean {
        var sale = this.activeSaleService.sale;
        return sale != null && sale.id == null;
    }

    get sale():LocalSale {
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

// The component
@Component({
    selector: 'command-view',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [CommandViewHeader, ItemVariantSaleList, CustomerSelectInputComponent]
})
export class CommandView {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    @Input()
    newSale:boolean = false;
    @Input()
    noInput:boolean;
    @Input()
    validated:boolean = false;
    @Output()
    saleEmptied = new EventEmitter();
    @Output()
    validateChanged = new EventEmitter();

    editingReference:boolean;
    editingDateTime:boolean;
    editingCustomer:boolean;
    newSaleReference:string;
    newSaleDateTimeString:string;
    newCustomer:LocalCustomer;

    variantSaleColumns:Immutable.List<ItemVariantSaleColumn>;

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
        this.variantSaleColumns = Immutable.List([
            ItemVariantSaleColumn.VARIANT_REF,
            ItemVariantSaleColumn.VARIANT_NAME_COMMENT,
            ItemVariantSaleColumn.QUANTITY_PRICE,
            ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE,
            ItemVariantSaleColumn.ACTIONS
        ]);
    }

    onValidateChanged(validated) {
        if (validated) {
            this.activeSaleService.searchPaidAmount();
        }
        this.validated = validated;
        this.validateChanged.emit(validated);
    }

    onVariantUpdated(variant:LocalItemVariantSale) {
        this.activeSaleService.doUpdateItem(variant)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onColumnAction(event:ItemVariantSaleColumnActionEvent) {
        var variantSale = event.itemVariantSale;
        var action = event.action;
        if (action == ItemVariantSaleColumnAction.REMOVE) {
            this.doRemoveItem(variantSale);
        }
    }

    doRemoveItem(localItemVariantSale:LocalItemVariantSale) {
        this.activeSaleService.doRemoveItem(localItemVariantSale)
            .then(()=> {
                var searchResult = this.activeSaleService.saleItemsResult;
                if (searchResult.list.size === 0) {
                    this.saleEmptied.emit(null);
                }
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onEditRefClicked() {
        this.editingReference = true;
        this.newSaleReference = this.activeSaleService.sale.reference;
    }

    onConfirmNewReference() {
        this.activeSaleService.doSetSaleReference(this.newSaleReference);
        this.editingReference = false;
        this.newSaleReference = null;
    }

    onCancelNewReference() {
        this.editingReference = false;
        this.newSaleReference = null;
    }

    onEditTimeClicked() {
        var dateTime = this.activeSaleService.sale.dateTime;
        var isoString = dateTime.toISOString();
        // input[type=datetime-local] required in chrome for the calendar widget.
        // On the other hand, this does not accept timezone values, so strip it off
        var zIndex = isoString.indexOf('Z');
        this.newSaleDateTimeString = isoString.substring(0, zIndex);
        this.editingDateTime = true;
    }

    onConfirmNewDateTime() {
        var date:Date = new Date(this.newSaleDateTimeString);
        this.activeSaleService.doSetSaleDateTime(date);
        this.editingDateTime = false;
        this.newSaleDateTimeString = null;
    }

    onCancelNewDateTime() {
        this.editingDateTime = false;
        this.newSaleDateTimeString = null;
    }

    onEditCustomerClicked() {
        this.editingCustomer = true;
        this.newCustomer = this.activeSaleService.sale.customer;
    }

    onNewCustomerSelected(customer:LocalCustomer) {
        this.newCustomer = customer;
        this.onConfirmNewCustomer();
    }

    onConfirmNewCustomer() {
        this.activeSaleService.doSetSaleCustomer(this.newCustomer);
        this.editingCustomer = false;
        this.newCustomer = null;
    }

    onCancelNewCustomer() {
        this.editingCustomer = false;
        this.newCustomer = null;
    }

    onRemoveSaleCustomer() {
        this.activeSaleService.doSetSaleCustomer(null);
        this.onCancelNewCustomer();
    }

}
