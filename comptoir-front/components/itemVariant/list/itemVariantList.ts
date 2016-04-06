/**
 * Created by cghislai on 29/07/15.
 */

import {
    Component, ChangeDetectionStrategy, OnInit, EventEmitter, ViewEncapsulation, Input,
    Output
} from "angular2/core";
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from "angular2/common";
import {ItemVariant, ItemVariantFactory} from "../../../domain/commercial/itemVariant";
import {Language, LocaleTextsFactory} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {FocusableDirective} from "../../utils/focusable";
import {Column} from "../../utils/column";
import * as Immutable from "immutable";
import {Pricing} from "../../../client/domain/util/pricing";

/****
 * Column component
 */
@Component({
    selector: 'itemvariant-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariant/list/itemVariantColumn.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemVariantColumnComponent {
    @Input()
    itemVariant:ItemVariant;
    @Input()
    column:ItemVariantColumn;
    @Input()
    lang:Language;
    @Output()
    action = new EventEmitter();

    onColumnAction(item:ItemVariant, column:ItemVariantColumn, event) {
        this.action.next({itemVariant: item, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

    getPricingLabel(pricing:Pricing) {
        return ItemVariantFactory.getPricingLabel(pricing).get(this.lang.locale);
    }

    getVariantPrice(itemVariant:ItemVariant) {
        return ItemVariantFactory.calcPrice(itemVariant, true);
    }
}


/*****
 * List component
 */

@Component({
    selector: 'itemvariant-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariant/list/itemVariantList.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemVariantColumnComponent]
})

export class ItemVariantListComponent implements OnInit {
    @Input()
    items:Immutable.List<ItemVariant>;
    @Input()
    columns:Immutable.List<ItemVariantColumn>;
    @Input()
    rowSelectable:boolean;
    @Input()
    headersVisible:boolean;

    @Output()
    rowClicked = new EventEmitter();
    @Output()
    columnAction = new EventEmitter();

    language:Language;
    columnWeightToPercentage:number;


    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }

    ngOnInit() {
        this.calcColumnWeightFactor();
    }


    calcColumnWeightFactor() {
        let totWeight = this.columns.valueSeq()
            .reduce((r, col)=>r + col.weight, 0);
        this.columnWeightToPercentage = 100.0 / totWeight;
    }

    onItemClick(item:ItemVariant, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onItemKeyDown(item:ItemVariant, event) {
        // TODO: use event.key once supported
        switch (event.which) {
            case 13:
            {
                // Enter
                this.rowClicked.emit(item);
                break;
            }
            case 38:
            {
                // Up
                this.selectPrevious(event.target);
                break;
            }
            case 40:
            {
                // Down
                this.selectNext(event.target);
                break;
            }
        }
    }

    private selectPrevious(element:HTMLElement) {
        var previous = <HTMLElement>element.previousElementSibling;
        if (previous) {
            previous.focus();
        }
    }

    private selectNext(element:HTMLElement) {
        var next = <HTMLElement>element.nextElementSibling;
        if (next) {
            next.focus();
        }
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class ItemVariantColumn extends Column {

    static ID:ItemVariantColumn;
    static VARIANT_REFERENCE:ItemVariantColumn;
    static PICTURE:ItemVariantColumn;
    static PICTURE_NO_ITEM_FALLBACK:ItemVariantColumn;
    static PRICING:ItemVariantColumn;
    static PRICING_AMOUNT:ItemVariantColumn;
    static ATTRIBUTES:ItemVariantColumn;

    static ITEM_REFERENCE:ItemVariantColumn;
    static ITEM_NAME:ItemVariantColumn;
    static ITEM_DESCRIPTION:ItemVariantColumn;
    static ITEM_NAME_VARIANT_ATTRIBUTES:ItemVariantColumn;
    static ITEM_VAT_EXCLUSIVE:ItemVariantColumn;
    static ITEM_VAT_RATE:ItemVariantColumn;
    static ITEM_VAT_INCLUSIVE:ItemVariantColumn;

    static TOTAL_PRICE:ItemVariantColumn;

    static ACTION_REMOVE:ItemVariantColumn;

    static init() {
        ItemVariantColumn.ID = new ItemVariantColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            })
        );

        ItemVariantColumn.VARIANT_REFERENCE = new ItemVariantColumn(
            'variantReference', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref'
            })
        );

        ItemVariantColumn.PICTURE = new ItemVariantColumn(
            'picture', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK = new ItemVariantColumn(
            'pictureNoItemFallback', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemVariantColumn.PRICING = new ItemVariantColumn(
            'pricing', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Mode tarification'
            })
        );

        ItemVariantColumn.PRICING_AMOUNT = new ItemVariantColumn(
            'pricingAmount', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Valeur tarification'
            }), true
        );

        ItemVariantColumn.ATTRIBUTES = new ItemVariantColumn(
            'attributes', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Attributs'
            })
        );

        ItemVariantColumn.ITEM_REFERENCE = new ItemVariantColumn(
            'itemReference', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref (parent)'
            })
        );

        ItemVariantColumn.ITEM_NAME = new ItemVariantColumn(
            'itemName', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom'
            })
        );

        ItemVariantColumn.ITEM_DESCRIPTION = new ItemVariantColumn(
            'itemDescription', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Description'
            })
        );

        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES = new ItemVariantColumn(
            'itemNameVariantAttributes', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom / Attributs'
            })
        );

        ItemVariantColumn.ITEM_VAT_EXCLUSIVE = new ItemVariantColumn(
            'itemVatExclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix HTVA (parent)'
            }), true
        );

        ItemVariantColumn.ITEM_VAT_RATE = new ItemVariantColumn(
            'itemVatRate', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Taux TVA'
            }), true
        );

        ItemVariantColumn.ITEM_VAT_INCLUSIVE = new ItemVariantColumn(
            'itemVatInclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix (parent)'
            }), true
        );

        ItemVariantColumn.TOTAL_PRICE = new ItemVariantColumn(
            'totalPrice', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix total'
            }), true
        );

        ItemVariantColumn.ACTION_REMOVE = new ItemVariantColumn(
            'action_remove', 1
        );
    }
}

ItemVariantColumn.init();
