/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy, Output, Input} from "angular2/core";
import * as Immutable from "immutable";
import {ActiveSaleService} from "../../../../services/activeSale";
import {ErrorService} from "../../../../services/error";
import {
    ItemVariantSaleColumn, ItemVariantSaleList,
    ItemVariantSaleColumnActionEvent, ItemVariantSaleColumnAction
} from "../../../itemVariantSale/list/itemVariantSaleList";
import {LocalStock} from "../../../../client/localDomain/stock";
import {LocalItemVariantSale} from "../../../../client/localDomain/itemVariantSale";
import {LocalCustomer} from "../../../../client/localDomain/customer";
import {NumberUtils} from "../../../../client/utils/number";
import {FORM_DIRECTIVES} from "angular2/common";
import {FastInput} from "../../../utils/fastInput";
import {CustomerSelectInputComponent} from "../../../customer/select/customerSelectInput";
import {PosSelect} from "../../../pos/posSelect/posSelect";
import {EditLinkComponent} from "../../../utils/editLink/editLink";

// The component
@Component({
    selector: 'sale-details-component',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sales/sale/detailsView/detailsView.html',
    styleUrls: ['./components/sales/sale/detailsView/detailsView.css'],
    directives: [ItemVariantSaleList, FORM_DIRECTIVES, FastInput,
        CustomerSelectInputComponent, PosSelect, EditLinkComponent]
})
export class SaleDetailsComponent {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    @Input()
    stockList:Immutable.List<LocalStock>;

    @Output()
    validated = new EventEmitter();
    @Output()
    reopened = new EventEmitter();
    @Output()
    saleEmptied = new EventEmitter();
    @Output()
    editAction = new EventEmitter();

    private saleClosing: boolean;
    variantSaleColumns:Immutable.List<ItemVariantSaleColumn>;
    editableColumns:Immutable.List<ItemVariantSaleColumn>;

    newSaleReference:string;
    newSaleDateTimeString:string;
    newSaleDiscount:number;

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;

        this.variantSaleColumns = Immutable.List([
            ItemVariantSaleColumn.VARIANT_REF,
            ItemVariantSaleColumn.VARIANT_NAME_COMMENT,
            ItemVariantSaleColumn.STOCK,
            ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY,
            ItemVariantSaleColumn.QUANTITY,
            ItemVariantSaleColumn.UNIT_PRICE,
            ItemVariantSaleColumn.DISCOUNT,
            ItemVariantSaleColumn.TOTAL_PRICE
        ]);

        this.initColumns();
    }

    private initColumns() {
        this.editableColumns = Immutable.List([]);
        this.variantSaleColumns = Immutable.List([
            ItemVariantSaleColumn.VARIANT_REF,
            ItemVariantSaleColumn.VARIANT_NAME_COMMENT,
            ItemVariantSaleColumn.STOCK,
            ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY,
            ItemVariantSaleColumn.QUANTITY,
            ItemVariantSaleColumn.UNIT_PRICE,
            ItemVariantSaleColumn.DISCOUNT,
            ItemVariantSaleColumn.TOTAL_PRICE
        ]);

        if (this.activeSaleService.sale == null) {
            return;
        }
        if (this.activeSaleService.sale.closed) {
            return;
        }
        this.variantSaleColumns = this.variantSaleColumns.push(ItemVariantSaleColumn.ACTIONS);
        this.editableColumns = Immutable.List([
            ItemVariantSaleColumn.VARIANT_NAME_COMMENT,
            ItemVariantSaleColumn.STOCK,
            ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY,
            ItemVariantSaleColumn.QUANTITY,
            ItemVariantSaleColumn.UNIT_PRICE,
            ItemVariantSaleColumn.DISCOUNT,
            ItemVariantSaleColumn.ACTIONS
        ]);
    }

    onVariantUpdated(variant:LocalItemVariantSale) {
        this.activeSaleService.doUpdateItem(variant)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doEdit() {
        this.editAction.emit(null);
    }

    doValidate() {
        if (this.saleClosing) {
            return;
        }
        this.saleClosing = true;
        this.activeSaleService.doCloseSale()
            .then(() => {
                this.saleClosing = false;
                this.validated.emit(true);
                this.initColumns();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    doReopen() {
        if (this.saleClosing) {
            return;
        }
        this.saleClosing = true;
        this.activeSaleService.doReopensale()
            .then(() => {
                this.saleClosing = false;
                this.initColumns();
                this.reopened.emit(true);
            })
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
        this.newSaleReference = this.activeSaleService.sale.reference;
    }

    onConfirmNewReference() {
        this.activeSaleService.doSetSaleReference(this.newSaleReference);
        this.newSaleReference = null;
    }

    onCancelNewReference() {
        this.newSaleReference = null;
    }

    onEditTimeClicked() {
        var dateTime = this.activeSaleService.sale.dateTime;
        var isoString = dateTime.toISOString();
        // input[type=datetime-local] required in chrome for the calendar widget.
        // On the other hand, this does not accept timezone values, so strip it off
        var zIndex = isoString.indexOf('Z');
        this.newSaleDateTimeString = isoString.substring(0, zIndex);
    }

    onConfirmNewDateTime() {
        var date:Date = new Date(this.newSaleDateTimeString);
        this.activeSaleService.doSetSaleDateTime(date);
        this.newSaleDateTimeString = null;
    }

    onCancelNewDateTime() {
        this.newSaleDateTimeString = null;
    }

    onNewCustomerSelected(customer:LocalCustomer) {
        this.activeSaleService.doSetSaleCustomer(customer);
    }

    onRemoveSaleCustomer() {
        this.activeSaleService.doSetSaleCustomer(null);
    }

    onEditDiscountClicked() {
        var ratio = this.activeSaleService.sale.discountRatio * 100;
        this.newSaleDiscount = ratio;
    }

    onConfirmNewDiscount() {
        var ratio = this.newSaleDiscount / 100;
        ratio = NumberUtils.toFixedDecimals(ratio, 2);
        this.activeSaleService.doSetSaleDiscountRatio(ratio);
        this.newSaleDiscount = null;
    }

    onCancelNewDiscount() {
        this.newSaleDiscount = null;
    }


    onPosChanged(pos) {
        this.activeSaleService.setPos(pos)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


}
