/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf,
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalItem} from 'client/localDomain/item';

import {Item} from 'client/domain/item';
import {ItemVariant} from 'client/domain/itemVariant';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemService} from 'services/item';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {percentageValidator} from 'components/utils/validators';


@Component({
    selector: 'editItem',
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective, FormMessage]
})
export class ItemsEdiView {
    itemService:ItemService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    item:LocalItem;
    itemNames:LocaleTexts;
    itemDescriptions:LocaleTexts;
    itemForm:ControlGroup;
    appLocale:string;
    editLanguage:Language;
    allLanguages:Language[];

    formBuilder:FormBuilder;


    constructor(itemService:ItemService, errorService:ErrorService, authService:AuthService,
                routeParams:RouteParams, router:Router, formBuilder:FormBuilder) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();

        this.findItem(routeParams);
    }

    buildForm() {
        var vatRate = this.item.vatRate;
        if (vatRate == null || vatRate == 0) {
            var country = this.authService.companyCountry;
            vatRate = country.defaultVatRate;
        }
        var vatPercentage = NumberUtils.toInt(vatRate * 100);
        this.itemForm = this.formBuilder.group({
            'reference': [this.item.reference],
            'name': [this.item.name[this.editLanguage.locale]],
            'description': [this.item.description[this.editLanguage.locale]],
            'vatExclusive': [this.item.vatExclusive],
            'vatPercentage': [vatPercentage, percentageValidator]
        });
        this.itemNames = this.item.name;
        this.itemDescriptions = this.item.description;
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItem();
            return;
        }
        var idParam = routeParams.get('id');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam == 'new') {
                this.getNewItem();
                return;
            }
            this.getNewItem();
            return;
        }
        this.getItem(idNumber);
    }

    getNewItem() {
        this.item = new LocalItem();
        this.item.description = new LocaleTexts();
        this.item.name = new LocaleTexts();
        this.buildForm();
    }

    getItem(id:number) {
        this.itemService.getLocalItemAsync(id)
            .then((item:LocalItem)=> {
                this.item = item;
                this.buildForm();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        var item = this.item;
        item.description = this.itemDescriptions;
        item.name = this.itemNames;
        item.reference = this.itemForm.value.reference;
        var vatExclusive = parseFloat(this.itemForm.value.vatExclusive);
        item.vatExclusive = NumberUtils.toFixedDecimals(vatExclusive, 2);
        var vatPecentage = parseInt(this.itemForm.value.vatPercentage);
        item.vatRate = NumberUtils.toFixedDecimals(vatPecentage / 100, 2);

        this.itemService.saveLocalItemAsync(item)
            .then(() => {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length != 1) {
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
                if (thisView.item.mainPicture == null) {
                    thisView.item.mainPicture = new LocalPicture();
                }
                thisView.item.mainPicture.dataURI = data;
            });
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        var priceFloat = parseFloat(price);
        this.item.vatExclusive = NumberUtils.toFixedDecimals(priceFloat, 2);
    }

    onVatChanged(event) {
        var vat = event.target.value;
        var vatPercentage = parseInt(vat);
        this.item.vatRate = NumberUtils.toFixedDecimals(vatPercentage / 100, 2);
    }

}
