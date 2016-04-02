/**
 * Created by cghislai on 31/07/15.
 */
import {Component} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Router} from "angular2/router";
import {Item} from "../../../domain/commercial/item";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {ErrorService} from "../../../services/error";
import {ItemService} from "../../../services/item";
import {AuthService} from "../../../services/auth";
import {ItemList, ItemColumn} from "../../../components/item/list/itemList";
import {Paginator} from "../../../components/utils/paginator/paginator";
import * as Immutable from "immutable";
import {WsItemSearch} from "../../../client/domain/search/itemSearch";

@Component({
    selector: 'product-list',
    templateUrl: './routes/items/list/listView.html',
    styleUrls: ['./routes/items/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, FORM_DIRECTIVES, ItemList]
})

export class ItemsListView {
    itemService:ItemService;
    errorService:ErrorService;
    router:Router;

    searchRequest: SearchRequest<Item>;
    searchResult:SearchResult<Item>;
    columns:Immutable.List<ItemColumn>;
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;

    constructor(appService:ErrorService, authService: AuthService,
                itemService:ItemService, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = appService;

        this.searchRequest = new SearchRequest<Item>();
        var itemSearch = new WsItemSearch();
        itemSearch.companyRef = authService.getEmployeeCompanyRef();
        itemSearch.locale = authService.getEmployeeLanguage().locale;
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.itemsPerPage});
        this.searchRequest.search = itemSearch;
        this.searchRequest.pagination = pagination;

        this.columns = Immutable.List.of(
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME,
            ItemColumn.VAT_EXCLUSIVE,
            ItemColumn.VAT_RATE,
            ItemColumn.VAT_INCLUSIVE,
            ItemColumn.ACTION_REMOVE
        );
        this.searchItems();
    }

    searchItems() {
        this.itemService.search(this.searchRequest)
            .then((result:SearchResult<Item>)=> {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchItems();
    }

    onColumnAction(event) {
        var item:Item = event.item;
        var column:ItemColumn = event.column;
        if (column === ItemColumn.ACTION_REMOVE) {
            this.doRemoveItem(item);
        }
    }

    doEditItem(item:Item) {
        var id = item.id;
        this.router.navigate(['/Items/Edit/EditItem', {itemId: id}]);
    }

    doRemoveItem(item:Item) {
        this.itemService.remove(item.id)
            .then(()=> {
                this.searchItems();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    handleFilterKeyUp(event) {
        if (this.keyboardTimeoutSet) {
            return;
        }
        this.keyboardTimeoutSet = true;
        var thisList = this;
        setTimeout(function () {
            thisList.keyboardTimeoutSet = false;
            thisList.searchItems();
        }, this.keyboardTimeout);
    }

}
