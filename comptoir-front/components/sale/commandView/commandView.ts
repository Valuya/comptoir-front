/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy, Output, Input} from "angular2/core";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import * as Immutable from "immutable";
import {FastInputDirective} from "../../utils/fastInput";
import {ActiveSaleService} from "../../../services/activeSale";
import {ErrorService} from "../../../services/error";
import {Sale} from "../../../domain/commercial/sale";
import {NumberUtils} from "../../../client/utils/number";
import {
    ItemVariantSaleListComponent,
    ItemVariantSaleColumn,
    ItemVariantSaleColumnActionEvent,
    ItemVariantSaleColumnAction
} from "../../itemVariantSale/list/itemVariantSaleList";
import {CustomerSelectComponent} from "../../customer/select/customerSelect";
import {Customer} from "../../../domain/thirdparty/customer";
import {ItemVariantSale} from "../../../domain/commercial/itemVariantSale";
import {CommandViewHeaderComponent} from "./header/commandViewHeader";

// The component
@Component({
    selector: 'command-view',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sale/commandView/commandView.html',
    styleUrls: ['./components/sale/commandView/commandView.css'],
    directives: [CommandViewHeaderComponent, ItemVariantSaleListComponent, CustomerSelectComponent]
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
    editingCustomer:boolean;
    newSaleReference:string;
    newCustomer:Customer;

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

    onVariantUpdated(variant:ItemVariantSale) {
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

    doRemoveItem(localItemVariantSale:ItemVariantSale) {
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

    onEditCustomerClicked() {
        this.editingCustomer = true;
        this.newCustomer = this.activeSaleService.sale.customer;
    }

    onNewCustomerSelected(customer:Customer) {
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
