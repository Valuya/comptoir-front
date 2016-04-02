/**
 * Created by cghislai on 29/07/15.
 */

import {
    Component,
    EventEmitter,
    ChangeDetectionStrategy,
    Output,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input
} from "angular2/core";
import {NgFor, NgIf} from "angular2/common";
import {ItemVariantList, ItemVariantColumn} from "../list/itemVariantList";
import {ItemList, ItemColumn} from "../../item/list/itemList";
import {ItemService} from "../../../services/item";
import {ItemVariantService} from "../../../services/itemVariant";
import {ItemVariantStockService} from "../../../services/itemVariantStock";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {Item} from "../../../domain/commercial/item";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {ItemVariant} from "../../../domain/commercial/itemVariant";
import {WsItemRef} from "../../../client/domain/commercial/item";
import {PaginationFactory} from "../../../client/utils/pagination";
import {Observable} from "rxjs/Observable";
import {WsItemSearch} from "../../../client/domain/search/itemSearch";
import {WsItemVariantSearch} from "../../../client/domain/search/itemVariantSearch";


@Component({
    selector: 'item-variant-select',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/itemVariant/select/selectView.html',
    styleUrls: ['./components/itemVariant/select/selectView.css'],
    directives: [NgFor, NgIf, ItemList, ItemVariantList]
})

export class ItemVariantSelectView implements AfterViewInit {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    itemVariantStockService:ItemVariantStockService;
    errorService:ErrorService;
    authService:AuthService;

    @Output()
    itemClicked = new EventEmitter();
    @Output()
    variantSelected = new EventEmitter();
    @Input()
    coloredHeader: boolean = true;
    @Input()
    tableHeaders: boolean;

    keyboardTimeout:number = 200;
    searchRequest:SearchRequest<Item>;
    searchResult:SearchResult<Item>;
    columns:Immutable.List<ItemColumn>;

    variantRequest:SearchRequest<ItemVariant>;
    variantResult:SearchResult<ItemVariant>;
    variantColumns:Immutable.List<ItemVariantColumn>;
    variantSelection:boolean;

    @ViewChild('filter')
    inputFieldResult:ElementRef;
    inputFieldValue:string;

    constructor(errorService:ErrorService, itemService:ItemService,
                itemVariantStockService:ItemVariantStockService,
                itemVariantService:ItemVariantService, authService:AuthService) {
        this.itemService = itemService;
        this.errorService = errorService;
        this.itemVariantStockService = itemVariantStockService;
        this.authService = authService;
        this.itemVariantService = itemVariantService;

        var itemSearch = new WsItemSearch();
        itemSearch.multiSearch = null;
        itemSearch.locale = authService.getEmployeeLanguage().locale;
        itemSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.searchRequest = new SearchRequest<Item>();
        this.searchRequest.search = itemSearch;
        this.searchRequest.pagination = pagination;
        this.searchResult = new SearchResult<Item>();

        var variantSearch = new WsItemVariantSearch();
        variantSearch.itemSearch = new WsItemSearch();
        variantSearch.itemSearch.companyRef = authService.getEmployeeCompanyRef();
        variantSearch.itemSearch.locale = authService.getEmployeeLanguage().locale;
        var variantPagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.variantRequest = new SearchRequest<ItemVariant>();
        this.variantRequest.search = variantSearch;
        this.variantRequest.pagination = variantPagination;
        this.variantResult = new SearchResult<ItemVariant>();
        this.variantSelection = false;

        this.columns = Immutable.List.of(
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME,
            ItemColumn.VAT_INCLUSIVE
        );
        this.variantColumns = Immutable.List.of(
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE
        );
        this.searchItems();
    }

    ngAfterViewInit() {
        if (this.inputFieldResult == null) {
            console.error('Invalid field');
            return;
        }
        Observable.fromEvent(this.inputFieldResult.nativeElement, 'keyup')
            .map((event:KeyboardEvent) => {
                var target = <HTMLInputElement>event.target;
                return target.value;
            })
            .distinctUntilChanged()
            .debounceTime(this.keyboardTimeout)
            .subscribe((value:string)=> {
                this.applyFilter(value);
            });
        this.focus();
    }


    searchItems():Promise<any> {
        return this.itemService.search(this.searchRequest)
            .then((result)=> {
                this.searchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchItemVariants():Promise<any> {
        return this.itemVariantService.search(this.variantRequest)
            .then((result)=> {
                this.variantResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    applyFilter(filterValue:string):Promise<any> {
        var variantSearch = this.variantRequest.search.itemSearch;
        if (variantSearch.multiSearch != filterValue) {
            variantSearch.multiSearch = filterValue;
        }
        var itemSearch = this.searchRequest.search;
        if (itemSearch.multiSearch != filterValue) {
            itemSearch.multiSearch = filterValue;
        }

        if (this.variantSelection) {
            return this.searchItemVariants();
        } else {
            return this.searchItems();
        }
    }

    clearFilter() {
        this.applyFilter(null);
        this.inputFieldValue = null;
    }

    onItemClicked(item:Item) {
        this.itemClicked.emit(item);
        var variantSearch = this.variantRequest.search;
        var itemRef = new WsItemRef(item.id);
        variantSearch.itemRef = itemRef;
        this.itemVariantService.search(this.variantRequest)
            .then((results)=> {
                this.variantResult = results;
                if (results.count === 1) {
                    var variant = results.list.get(0);
                    return this.onVariantSelected(variant);
                } else {
                    this.variantSelection = true;
                    this.clearFilter();
                }
            })
            .then(()=> {
                this.focus();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onVariantSelected(variant:ItemVariant) {
        this.variantSelected.emit(variant);
        this.variantSelection = false;
        this.clearFilter();
        this.focus();
    }

    focus() {
        var element:HTMLInputElement = this.inputFieldResult.nativeElement;
        if (element) {
            element.focus();
            element.select();
        }
    }
}
