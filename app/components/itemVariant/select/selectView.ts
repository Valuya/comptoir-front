/**
 * Created by cghislai on 29/07/15.
 */

import {
    Component,
    EventEmitter,
    ChangeDetectionStrategy,
    Input,
    ViewChild,
    ElementRef,
    AfterViewInit
} from "angular2/core";
import {NgFor, NgIf} from "angular2/common";
import {ItemVariantList, ItemVariantColumn} from "../list/itemVariantList";
import {ItemList, ItemColumn} from "../../item/list/itemList";
import {FocusableDirective} from "../../utils/focusable";
import {AutoFocusDirective} from "../../utils/autoFocus";
import {ItemService} from "../../../services/item";
import {ItemVariantService} from "../../../services/itemVariant";
import {ItemVariantStockService} from "../../../services/itemVariantStock";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {LocalItem} from "../../../client/localDomain/item";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {LocalItemVariant} from "../../../client/localDomain/itemVariant";
import {LocalStock} from "../../../client/localDomain/stock";
import {ItemSearch, ItemRef} from "../../../client/domain/item";
import {PaginationFactory} from "../../../client/utils/pagination";
import {ItemVariantSearch} from "../../../client/domain/itemVariant";
import {Observable} from "rxjs/Observable";


@Component({
    selector: 'item-variant-select',
    outputs: ['itemClicked', 'variantSelected'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/itemVariant/select/selectView.html',
    styleUrls: ['./components/itemVariant/select/selectView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemList, ItemVariantList]
})

export class ItemVariantSelectView implements AfterViewInit {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    itemVariantStockService:ItemVariantStockService;
    errorService:ErrorService;
    authService:AuthService;

    itemClicked = new EventEmitter();
    variantSelected = new EventEmitter();
    keyboardTimeout:number = 200;
    searchRequest:SearchRequest<LocalItem>;
    searchResult:SearchResult<LocalItem>;
    columns:Immutable.List<ItemColumn>;

    variantRequest:SearchRequest<LocalItemVariant>;
    variantResult:SearchResult<LocalItemVariant>;
    variantColumns:Immutable.List<ItemVariantColumn>;
    variantSelection:boolean;

    @Input()
    stock: LocalStock;

    @ViewChild('filter')
    inputFieldResult:ElementRef;

    constructor(errorService:ErrorService, itemService:ItemService,
                itemVariantStockService:ItemVariantStockService,
                itemVariantService:ItemVariantService, authService:AuthService) {
        this.itemService = itemService;
        this.errorService = errorService;
        this.itemVariantStockService = itemVariantStockService;
        this.authService = authService;
        this.itemVariantService = itemVariantService;

        var itemSearch = new ItemSearch();
        itemSearch.multiSearch = null;
        itemSearch.locale = authService.getEmployeeLanguage().locale;
        itemSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.searchRequest = new SearchRequest<LocalItem>();
        this.searchRequest.search = itemSearch;
        this.searchRequest.pagination = pagination;
        this.searchResult = new SearchResult<LocalItem>();

        var variantSearch = new ItemVariantSearch();
        variantSearch.itemSearch = new ItemSearch();
        variantSearch.itemSearch.companyRef = authService.getEmployeeCompanyRef();
        variantSearch.itemSearch.locale = authService.getEmployeeLanguage().locale;
        var variantPagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.variantRequest = new SearchRequest<LocalItemVariant>();
        this.variantRequest.search = variantSearch;
        this.variantRequest.pagination = variantPagination;
        this.variantResult = new SearchResult<LocalItemVariant>();
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
            ItemVariantColumn.CURRENT_STOCK_AMOUNT,
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
            .map(() => this.searchRequest.search.multiSearch)
            .debounceTime(this.keyboardTimeout)
            .distinctUntilChanged()
            .subscribe((value: string)=> {
                this.applyFilter(value);
            });
    }

    searchItems(): Promise<any> {
        return this.itemService.search(this.searchRequest)
            .then((result)=> {
                this.searchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchItemVariants(): Promise<any> {
        return this.itemVariantService.search(this.variantRequest)
            .then((result)=> {
                var taskList = result.list.toSeq()
                    .map((itemVariant)=>{
                        return this.itemVariantStockService.fetchCurrentItemStock(itemVariant, this.stock);
                    })
                    .toArray();
                return Promise.all(taskList)
                    .then((results: LocalItemVariant[])=>{
                        result.list = Immutable.List(results);
                        return result;
                    });
            })
            .then((result)=>{
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

    onItemClicked(item:LocalItem) {
        this.itemClicked.emit(item);
        var variantSearch = this.variantRequest.search;
        var itemRef = new ItemRef(item.id);
        variantSearch.itemRef = itemRef;
        this.itemVariantService.search(this.variantRequest)
            .then((results)=> {
                this.variantResult = results;
                if (results.count === 1) {
                    var variant = results.list.get(0);
                    return this.onVariantSelected(variant);
                } else {
                    this.variantSelection = true;
                    return this.applyFilter('');
                }
            }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantSelected(variant:LocalItemVariant) {
        this.variantSelected.emit(variant);
        this.variantSelection = false;
        return this.applyFilter('');
    }

    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
