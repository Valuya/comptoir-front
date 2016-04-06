/**
 * Created by cghislai on 05/08/15.
 */
import {Component, ChangeDetectionStrategy} from "angular2/core";
import {NgIf} from "angular2/common";
import {RouteParams, Router, RouterLink, OnActivate} from "angular2/router";
import {Item, ItemFactory} from "../../../domain/commercial/item";
import {LocaleTextsFactory} from "../../../client/utils/lang";
import {ItemService} from "../../../services/item";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {ItemEditComponent} from "../../../components/item/edit/editItem";


@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [ItemEditComponent, NgIf, RouterLink]
})
export class ItemEditView implements OnActivate {
    itemService:ItemService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;
    routeParams:RouteParams;

    item:Item;


    constructor(itemService:ItemService, errorService:ErrorService,
                authService:AuthService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.routeParams = routeParams;
    }

    routerOnActivate() {
        this.findItem(this.routeParams);
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItem();
            return;
        }
        var idParam = routeParams.get('itemId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam === 'new') {
                this.getNewItem();
                return;
            }
            this.getNewItem();
            return;
        }
        this.getItem(idNumber);
    }

    getNewItem() {
        var itemDesc:any = {};
        itemDesc.description = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.name = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.company = this.authService.getEmployeeCompany();
        var company = this.authService.getEmployeeCompany();
        var country = company.country;
        var vatRate = country.defaultVatRate;
        itemDesc.vatRate = vatRate;
        this.item = ItemFactory.createNewItem(itemDesc);


    }

    getItem(id:number) {
        this.itemService.get(id)
            .then((item:Item)=> {
                this.item = item;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaved(item) {
        this.router.navigate(['/Items/List']);
    }

    onCancelled() {
        this.router.navigate(['/Items/List']);
    }

}

