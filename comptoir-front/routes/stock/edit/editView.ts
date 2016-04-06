/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from "angular2/core";
import {NgIf, NgForm, NgFor, FORM_DIRECTIVES} from "angular2/common";
import {RouteParams, Router, RouterLink} from "angular2/router";
import {Stock, StockFactory} from "../../../domain/stock/stock";
import {AuthService} from "../../../services/auth";
import {StockService} from "../../../services/stock";
import {ErrorService} from "../../../services/error";
import {LocaleTexts, Language} from "../../../client/utils/lang";
import {StockEditComponent} from "../../../components/stock/edit/editStock";
import {ItemVariantSelectComponent} from "../../../components/itemVariant/select/itemVariantSelect";
import {ItemVariant} from "../../../domain/commercial/itemVariant";
import {ItemVariantStock, ItemVariantStockFactory} from "../../../domain/stock/itemVariantStock";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {
    WsItemVariantStockRef
} from "../../../client/domain/stock/itemVariantStock";
import {WsStockRef} from "../../../client/domain/stock/stock";
import {WsItemVariantRef} from "../../../client/domain/commercial/itemVariant";
import {ItemVariantStockService} from "../../../services/itemVariantStock";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {ItemVariantColumnComponent} from "../../../components/itemVariant/list/itemVariantList";
import {
    ItemVariantStockColumn,
    ItemVariantStockListComponent
} from "../../../components/itemVariantStock/list/itemVariantStockList";
import {RequiredValidator} from "../../../components/utils/validators";
import {PaginatorComponent} from "../../../components/utils/paginator/paginator";
import {WsItemVariantStockSearch} from "../../../client/domain/search/itemVariantStockSearch";
import {StockChangeType} from "../../../client/domain/util/stockChangeType";

@Component({
    templateUrl: './routes/stock/edit/editView.html',
    styleUrls: ['./routes/stock/edit/editView.css'],
    directives: [NgIf, NgFor, RouterLink, NgForm, StockEditComponent,
        ItemVariantSelectComponent, ItemVariantColumnComponent,
        PaginatorComponent,
        ItemVariantStockListComponent, RequiredValidator, FORM_DIRECTIVES]
})
export class EditStockView {
    stockService:StockService;
    errorService:ErrorService;
    authService:AuthService;
    variantStockService:ItemVariantStockService;
    router:Router;

    stock:Stock;
    displayLanguage: Language;

    itemVariant: ItemVariant;
    itemVariantCurrentStock: ItemVariantStock;
    itemVariantStockRequest: SearchRequest<ItemVariantStock>;
    itemVariantStockResult: SearchResult<ItemVariantStock>;
    editingVariantStockDesc: any;

    variantStockListColumns:  Immutable.List<ItemVariantStockColumn>;
    itemsPerPage = 10;

    constructor(stockService:StockService, authService:AuthService,
                errorService:ErrorService,
                variantStockService: ItemVariantStockService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.stockService = stockService;
        this.authService = authService;
        this.errorService = errorService;
        this.variantStockService = variantStockService;

        this.displayLanguage = this.authService.getEmployeeLanguage();
        this.variantStockListColumns = Immutable.List([
            ItemVariantStockColumn.START_DATE,
            ItemVariantStockColumn.CHANGE_TYPE,
            ItemVariantStockColumn.COMMENT,
            ItemVariantStockColumn.QUANTITY
        ]);

        this.itemVariantStockRequest = new SearchRequest<ItemVariantStock>();
        var search = new WsItemVariantStockSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        this.itemVariantStockRequest.search = search;
        var sorts = {
            'START_DATE_TIME': 'desc',
            'ORDER': 'desc'
        };
        var pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: this.itemsPerPage,
            sorts: sorts
        });
        this.itemVariantStockRequest.pagination = pagination;
        this.itemVariantStockResult = new SearchResult<ItemVariantStock>();

        this.findStock(routeParams);
    }

    findStock(routeParams:RouteParams): Promise<Stock> {
        if (routeParams == null || routeParams.params == null) {
            return this.getNewStock();
        }
        var itemIdParam = routeParams.get('id');
        var stockId = parseInt(itemIdParam);
        if (isNaN(stockId)) {
            if (itemIdParam === 'new') {
                return this.getNewStock();
            }
            return this.getNewStock();
        }
        return this.getStock(stockId);
    }

    getNewStock() : Promise<Stock> {
        var stockDesc: any = {};
        stockDesc.company = this.authService.getEmployeeCompany();
        stockDesc.description = new LocaleTexts();
        stockDesc.active = true;
        this.stock = StockFactory.createNewStock(stockDesc);
        return Promise.resolve(this.stock);
    }

    getStock(id:number) {
        return this.stockService.get(id)
            .then((stock)=> {
                this.stock = stock;
                return stock;
            });
    }

    onSaved(stock) {
        this.stockService.save(stock)
            .then(()=> {
                this.router.navigate(['/Stock/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelled() {
        this.router.navigate(['/Stock/List']);
    }

    onVariantSelected(variant: ItemVariant) {
        this.itemVariant =variant;
        this.searchVariantStocks();

        this.editingVariantStockDesc = {
            itemVariant: variant,
            stock: this.stock
        };
    }

    private searchVariantStocks() {
        if (this.stock.id == null) {
            throw 'No stock';
        }
        var stockRef = new WsStockRef(this.stock.id);
        this.itemVariantStockRequest.search.stockRef = stockRef;
        var variantRef = new WsItemVariantRef(this.itemVariant.id);
        this.itemVariantStockRequest.search.itemVariantRef = variantRef;

        var searchTask =  this.variantStockService.search(this.itemVariantStockRequest)
            .then((result)=>{
                this.itemVariantStockResult = result;
            });
        var currentTask = this.variantStockService.fetchCurrentItemStock(this.itemVariant, this.stock)
            .then((variantStock)=>{
                this.itemVariantCurrentStock = variantStock;
                this.editingVariantStockDesc.quantity = this.itemVariantCurrentStock.quantity;
            });
        return Promise.all([searchTask, currentTask]);
    }

    onCreateInitialStock() {
        this.editingVariantStockDesc.stockChangeType = StockChangeType.INITIAL;
        var variantStock = ItemVariantStockFactory.createNewItemVariantStock(this.editingVariantStockDesc);

        this.variantStockService.save(variantStock)
            .then(()=>{
                this.searchVariantStocks();
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.itemVariantStockRequest.pagination = ApplyPageChangeEvent(this.itemVariantStockRequest.pagination, pageChange);
        this.searchVariantStocks();
    }


    onCreateAdjustmentStock() {
        this.editingVariantStockDesc.stockChangeType = StockChangeType.ADJUSTMENT;
        this.editingVariantStockDesc.previousItemStockRef = new WsItemVariantStockRef(this.itemVariantCurrentStock.id);
        var variantStock = ItemVariantStockFactory.createNewItemVariantStock(this.editingVariantStockDesc);

        this.variantStockService.save(variantStock)
            .then(()=>{
                this.searchVariantStocks();
            });
    }
}
