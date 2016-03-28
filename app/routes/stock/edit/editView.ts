/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from "angular2/core";
import {NgIf, NgForm, NgFor, FORM_DIRECTIVES} from "angular2/common";
import {RouteParams, Router, RouterLink} from "angular2/router";
import {LocalStock, LocalStockFactory} from "../../../client/localDomain/stock";
import {AuthService} from "../../../services/auth";
import {StockService} from "../../../services/stock";
import {ErrorService} from "../../../services/error";
import {LocaleTexts, Language} from "../../../client/utils/lang";
import {StockEditComponent} from "../../../components/stock/edit/editStock";
import {ItemVariantSelectView} from "../../../components/itemVariant/select/selectView";
import {LocalItemVariant} from "../../../client/localDomain/itemVariant";
import {LocalItemVariantStock, LocalItemVariantStockFactory} from "../../../client/localDomain/itemVariantStock";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {
    StockChangeType, ItemVariantStockSearch,
    ItemVariantStockFactory, ItemVariantStockRef
} from "../../../client/domain/itemVariantStock";
import {StockRef} from "../../../client/domain/stock";
import {ItemVariantRef} from "../../../client/domain/itemVariant";
import {ItemVariantStockService} from "../../../services/itemVariantStock";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {ItemVariantColumn, ItemVariantColumnComponent} from "../../../components/itemVariant/list/itemVariantList";
import {
    ItemVariantStockColumn,
    ItemVariantStockList
} from "../../../components/itemVariantStock/list/itemVariantStockList";
import {RequiredValidator} from "../../../components/utils/validators";
import {Paginator} from "../../../components/utils/paginator/paginator";

@Component({
    selector: 'edit-stock',
    templateUrl: './routes/stock/edit/editView.html',
    styleUrls: ['./routes/stock/edit/editView.css'],
    directives: [NgIf, NgFor, RouterLink, NgForm, StockEditComponent,
        ItemVariantSelectView, ItemVariantColumnComponent,
        Paginator,
        ItemVariantStockList, RequiredValidator, FORM_DIRECTIVES]
})
export class EditStockView {
    stockService:StockService;
    errorService:ErrorService;
    authService:AuthService;
    variantStockService:ItemVariantStockService;
    router:Router;

    stock:LocalStock;
    displayLanguage: Language;

    itemVariant: LocalItemVariant;
    itemVariantCurrentStock: LocalItemVariantStock;
    itemVariantStockRequest: SearchRequest<LocalItemVariantStock>;
    itemVariantStockResult: SearchResult<LocalItemVariantStock>;
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

        this.itemVariantStockRequest = new SearchRequest<LocalItemVariantStock>();
        var search = new ItemVariantStockSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        this.itemVariantStockRequest.search = search;
        var sorts = {
            'START_DATE_TIME': 'desc'
        };
        var pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: this.itemsPerPage,
            sorts: sorts
        });
        this.itemVariantStockRequest.pagination = pagination;
        this.itemVariantStockResult = new SearchResult<LocalItemVariantStock>();

        this.findStock(routeParams);
    }

    findStock(routeParams:RouteParams): Promise<LocalStock> {
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

    getNewStock() : Promise<LocalStock> {
        var stockDesc: any = {};
        stockDesc.company = this.authService.getEmployeeCompany();
        stockDesc.description = new LocaleTexts();
        stockDesc.active = true;
        this.stock = LocalStockFactory.createNewStock(stockDesc);
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

    onVariantSelected(variant: LocalItemVariant) {
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
        var stockRef = new StockRef(this.stock.id);
        this.itemVariantStockRequest.search.stockRef = stockRef;
        var variantRef = new ItemVariantRef(this.itemVariant.id);
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
        var variantStock = LocalItemVariantStockFactory.createNewItemVariantStock(this.editingVariantStockDesc);

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
        this.editingVariantStockDesc.previousItemStockRef = new ItemVariantStockRef(this.itemVariantCurrentStock.id);
        var variantStock = LocalItemVariantStockFactory.createNewItemVariantStock(this.editingVariantStockDesc);

        this.variantStockService.save(variantStock)
            .then(()=>{
                this.searchVariantStocks();
            });
    }
}
