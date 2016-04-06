/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Router, RouterLink} from "angular2/router";
import {Picture, PictureFactory} from "../../../domain/commercial/picture";
import {Item, ItemFactory} from "../../../domain/commercial/item";
import {ItemVariant} from "../../../domain/commercial/itemVariant";
import {WsCompanyRef} from "../../../client/domain/company/company";
import {WsItemRef} from "../../../client/domain/commercial/item";
import {Language} from "../../../client/utils/lang";
import {NumberUtils} from "../../../client/utils/number";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {ItemService} from "../../../services/item";
import {ItemVariantService} from "../../../services/itemVariant";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {PictureService} from "../../../services/picture";
import {LangSelectComponent} from "../../../components/lang/langSelect/langSelect";
import {FormMessageComponent} from "../../../components/utils/formMessage/formMessage";
import {RequiredValidator} from "../../../components/utils/validators";
import {LocalizedInputDirective} from "../../lang/localizedInput/localizedInput";
import {ItemVariantListComponent, ItemVariantColumn} from "../../../components/itemVariant/list/itemVariantList";
import * as Immutable from "immutable";
import {WsItemSearch} from "../../../client/domain/search/itemSearch";
import {WsItemVariantSearch} from "../../../client/domain/search/itemVariantSearch";


@Component({
    selector: 'item-edit',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/item/edit/editItem.html',
    styleUrls: ['./components/item/edit/editItem.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelectComponent, LocalizedInputDirective, FormMessageComponent,
        ItemVariantListComponent, RequiredValidator]
})
export class ItemEditComponent implements OnInit {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;
    pictureService:PictureService;

    @Input()
    item:Item;

    @Output()
    saved = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();

    itemJS:any;
    itemTotalPrice:number;
    itemVatPercentage:number;
    itemVatPercentageString:string;
    itemPictureTouched:boolean;

    appLanguage:Language;
    editLanguage:Language;

    itemVariantSearchRequest:SearchRequest<ItemVariant>;
    itemVariantSearchResult:SearchResult<ItemVariant>;
    itemVariantListColumns:Immutable.List<ItemVariantColumn>;


    router:Router;

    constructor(itemService:ItemService, errorService:ErrorService, pictureService:PictureService,
                authService:AuthService, itemVariantService:ItemVariantService,
                router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;
        this.pictureService = pictureService;

        this.appLanguage = authService.getEmployeeLanguage();
        this.editLanguage = authService.getEmployeeLanguage();

        this.itemVariantListColumns = Immutable.List.of(
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE,
            ItemVariantColumn.ACTION_REMOVE
        );
        this.itemVariantSearchRequest = new SearchRequest<ItemVariant>();

    }

    ngOnInit() {
        this.itemJS = this.item.toJS();
        // FIXME: causes Lifecycle tick loops
        // Should probably be handled in the background in a editItemService
        this.findItemVariants();
        this.calcTotalPrice();
        this.calcVatPercentage();
    }

    findItemVariants() {
        var itemId = this.item.id;
        if (itemId == null) {
            return;
        }
        var variantSearch = new WsItemVariantSearch();
        var itemRef = new WsItemRef(itemId);
        variantSearch.itemRef = itemRef;
        variantSearch.itemSearch = new WsItemSearch();
        variantSearch.itemSearch.companyRef = new WsCompanyRef(this.authService.auth.employee.company.id);
        this.itemVariantSearchRequest.search = variantSearch;

        this.itemVariantService.search(this.itemVariantSearchRequest)
            .then((result)=> {
                this.itemVariantSearchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        this.saveItem()
            .then((item)=> {
                this.saved.emit(item);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    public doCancel() {
        this.cancelled.emit(null);
    }

    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length !== 1) {
            return;
        }
        var file = files[0];
        var thisView = this;

        new Promise<string>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data:string)=> {
                var mainPicture:Picture = PictureFactory.createNewPicture({
                    dataURI: data,
                    company: this.authService.getEmployeeCompany()
                });
                if (thisView.item.mainPicture != null) {
                    mainPicture = <Picture>thisView.item.mainPicture.merge(mainPicture);
                }
                thisView.itemJS.mainPicture = mainPicture.toJS();
                thisView.itemPictureTouched = true;
            });
    }

    setItemVatRate(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseInt(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        var vatRate = NumberUtils.toFixedDecimals(valueNumber / 100, 2);
        this.itemJS.vatRate = vatRate;
        this.calcTotalPrice();
        this.calcVatPercentage();
    }

    setItemTotalPrice(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        // Use 4 decimals to compute
        var vatExclusive = NumberUtils.toFixedDecimals(valueNumber / (1 + this.item.vatRate), 4);
        this.itemJS.vatExclusive = vatExclusive;
        this.calcTotalPrice();
        this.itemJS.vatExclusive = NumberUtils.toFixedDecimals(vatExclusive, 2);
    }

    setItemPrice(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        this.itemJS.vatExclusive = valueNumber;
        this.calcTotalPrice();
    }

    setItemMultipleSale(event) {
        var valueBoolean = event.target.checked;
        this.itemJS.multipleSale = valueBoolean;
    }

    doAddNewVariant() {
        this.saveItem().then((item)=> {
            this.router.navigate(['/Items/Edit/EditVariant', {itemId: item.id, variantId: 'new'}]);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantRowSelected(localVariant:ItemVariant) {
        var variantId = localVariant.id;
        var itemId = this.item.id;
        var nextTask = Promise.resolve();
        if (itemId == null) {
            nextTask.then(()=> {
                this.itemService.save(this.item);
            });
        }
        nextTask.then(()=> {
            this.router.navigate(['/Items/Edit/EditVariant', {itemId: itemId, variantId: variantId}]);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantColumnAction(event) {
        var column = event.column;
        var itemVariant:ItemVariant = event.itemVariant;
        if (column === ItemVariantColumn.ACTION_REMOVE) {
            this.itemVariantService.remove(itemVariant.id)
                .then(()=> {
                    this.findItemVariants();
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
    }

    private saveItem():Promise<Item> {
        if (this.itemPictureTouched) {
            var picture = PictureFactory.createNewPicture(this.itemJS.mainPicture);
            return this.pictureService.save(picture)
                .then((localPic:Picture)=> {
                    this.itemJS.mainPicture = localPic;
                    var item = ItemFactory.createNewItem(this.itemJS);
                    return this.itemService.save(item);
                });
        } else {
            var item = ItemFactory.createNewItem(this.itemJS);
            return this.itemService.save(item);
        }
    }

    private calcTotalPrice() {
        var totalPrice = this.itemJS.vatExclusive * (1 + this.itemJS.vatRate);
        totalPrice = NumberUtils.toFixedDecimals(totalPrice, 2);
        this.itemTotalPrice = totalPrice;
    }

    private calcVatPercentage() {
        var vatPercentage = NumberUtils.toInt(this.itemJS.vatRate * 100);
        this.itemVatPercentage = vatPercentage;
        this.itemVatPercentageString = vatPercentage + '';
    }

    onCancelClicked() {
        this.cancelled.emit(null);
    }

}

