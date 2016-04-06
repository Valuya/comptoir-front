/**
 * Created by cghislai on 05/08/15.
 */
import {
    Component, EventEmitter, OnInit, ChangeDetectionStrategy, ElementRef, ViewQuery,
    ViewChild, Input, Output
} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {RouterLink} from "angular2/router";
import {Picture, PictureFactory} from "../../../domain/commercial/picture";
import {AttributeValue, AttributeValueFactory} from "../../../domain/commercial/attributeValue";
import {ItemVariant, ItemVariantFactory} from "../../../domain/commercial/itemVariant";
import {AttributeDefinition, AttributeDefinitionFactory} from "../../../domain/commercial/attributeDefinition";
import {Language, LocaleTextsFactory} from "../../../client/utils/lang";
import {NumberUtils} from "../../../client/utils/number";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {ItemVariantService} from "../../../services/itemVariant";
import {AttributeDefinitionService} from "../../../services/attributeDefinition";
import {AttributeValueService} from "../../../services/attributeValue";
import {PictureService} from "../../../services/picture";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {LangSelectComponent} from "../../lang/langSelect/langSelect";
import {FormMessageComponent} from "../../utils/formMessage/formMessage";
import {RequiredValidator} from "../../utils/validators";
import {LocalizedInputDirective} from "../../lang/localizedInput/localizedInput";
import * as Immutable from "immutable";
import {WsAttributeDefinitionSearch} from "../../../client/domain/search/attributeDefinitionSearch";
import {Pricing, ALL_PRICINGS} from "../../../client/domain/util/pricing";
import {AttributeDefinitionSuggestionsComponent} from "../../attributeDefinition/suggestions/attributeDefinitionSuggestions";

@Component({
    selector: 'itemvariant-edit',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/itemVariant/edit/editVariant.html',
    styleUrls: ['./components/itemVariant/edit/editVariant.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelectComponent, LocalizedInputDirective, FormMessageComponent,
        RequiredValidator, AttributeDefinitionSuggestionsComponent]
})
export class ItemVariantEditComponent implements OnInit {
    itemVariantService:ItemVariantService;
    attributeValueService:AttributeValueService;
    attributeDefinitionService:AttributeDefinitionService;
    pictureService:PictureService;
    errorService:ErrorService;
    authService:AuthService;

    @Input()
    itemVariant:ItemVariant;

    @Output()
    saved = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();


    itemVariantModel:any;
    picture:Picture;

    newAttributeValue:AttributeValue;
    unsavedAttributes:Immutable.List<AttributeValue>;

    allPricings:Immutable.List<Pricing>;
    pricingAmountRequired:boolean;
    pictureTouched:boolean;

    totalPrice:number;

    appLanguage:Language;
    editLanguage:Language;

    constructor(itemVariantService:ItemVariantService, attributeDefinitionService:AttributeDefinitionService,
                pictureService:PictureService,
                errorService:ErrorService, authService:AuthService, attributeValueService:AttributeValueService) {
        this.itemVariantService = itemVariantService;
        this.attributeDefinitionService = attributeDefinitionService;
        this.attributeValueService = attributeValueService;
        this.pictureService = pictureService;
        this.errorService = errorService;
        this.authService = authService;

        this.appLanguage = authService.getEmployeeLanguage();
        this.editLanguage = authService.getEmployeeLanguage();
        this.allPricings = Immutable.List(ALL_PRICINGS);
        this.unsavedAttributes = Immutable.List([]);

        this.resetNewAttributeValue();
    }

    ngOnInit() {
        this.itemVariantModel = this.itemVariant.toJS();
        this.picture = this.itemVariant.mainPicture;
        this.checkPricingAmountRequired();
        this.calcTotalPrice();
    }

    private calcTotalPrice() {
        var itemVariant = ItemVariantFactory.createNewItemVariant(this.itemVariantModel);
        var totalPrice = ItemVariantFactory.calcPrice(itemVariant, true);
        if (isNaN(totalPrice)) {
            totalPrice = 0;
        }
        this.totalPrice = totalPrice;
    }


    getPricingLabel(pricing:Pricing) {
        return ItemVariantFactory.getPricingLabel(pricing).get(this.appLanguage.locale);
    }

    onDefinitionSelected(value:AttributeDefinition| string, element: HTMLInputElement) {
        if (value == null || typeof value == 'string') {
            var locale = this.editLanguage.locale;
            var nameTexts = {};
            if (element) {
                nameTexts[locale] = element.value;
            }
            this.newAttributeValue = <AttributeValue>this.newAttributeValue.set('attributeDefinition', AttributeDefinitionFactory.createAttributeDefinition({
                name: LocaleTextsFactory.toLocaleTexts(nameTexts)
            }));
            return;
        }
        this.newAttributeValue = <AttributeValue>this.newAttributeValue.set('attributeDefinition', value);
    }

    public onFormSubmit() {
        var itemVariant = ItemVariantFactory.createNewItemVariant(this.itemVariantModel);
        this.saveItemVariant(itemVariant)
            .then((itemVariant)=> {
                this.saved.emit(itemVariant);
            }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
        ;
    }

    // TODO: add warning for pending changes
    public onCancelClicked() {
        this.cancelled.emit(null);
    }

    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length !== 1) {
            return;
        }
        var file = files[0];
        new Promise<string>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data:string)=> {
            var mainPicture:Picture;
            var currentPicture = this.itemVariant.mainPicture;
            if (currentPicture == null) {
                var picDesc = {
                    dataURI: data,
                    company: this.authService.getEmployeeCompany()
                };
                mainPicture = PictureFactory.createNewPicture(picDesc);
            } else {
                mainPicture = <Picture>currentPicture.set('dataURI', data);
            }
            this.itemVariantModel.mainPicture = mainPicture.toJS();
            this.picture = mainPicture;
            this.pictureTouched = true;
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }


    onPricingChanged(event) {
        var pricing:Pricing = <Pricing>parseInt(event.target.value);
        this.itemVariantModel.pricing = pricing;
        this.checkPricingAmountRequired();
        this.calcTotalPrice();
    }


    setPricingAmount(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        valueNumber = NumberUtils.toFixedDecimals(valueNumber, 2);
        this.itemVariantModel.pricingAmount = valueNumber;
        this.calcTotalPrice();
    }

    checkPricingAmountRequired() {
        var required = true;
        if (this.itemVariantModel.pricing === Pricing.PARENT_ITEM) {
            required = false;
        }
        this.pricingAmountRequired = required;
    }

    doAddAttribute() {
        var attributeToAdd = this.newAttributeValue;
        if (this.itemVariantModel.id != null) {
            this.saveAttributeValue(attributeToAdd)
                .then((attributeValue)=> {
                    var curAttributes = this.itemVariant.attributeValues;
                    curAttributes.push(attributeValue);
                    var itemVariant = <ItemVariant>ItemVariantFactory.createNewItemVariant(this.itemVariantModel)
                        .set('attributeValues', curAttributes);
                    return this.saveItemVariant(itemVariant);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        } else {
            this.unsavedAttributes = this.unsavedAttributes.push(attributeToAdd);
        }
        this.resetNewAttributeValue();
    }

    doRemoveAttribute(attributeValue:AttributeValue) {
        var attributeSaved = attributeValue.id != null;
        if (attributeSaved) {
            var newAttributes = Immutable.List(this.itemVariantModel.attributeValues)
                .filter((existingAttribute:AttributeValue)=> {
                    return existingAttribute.id !== attributeValue.id;
                }).toArray();
            var itemVariant = <ItemVariant>ItemVariantFactory.createNewItemVariant(this.itemVariantModel).set('attributeValues', newAttributes);
            return this.saveItemVariant(itemVariant)
                .then((itemVariant)=> {
                    // TODO: remove?
                    // return this.attributeValueService.remove(attributeValue);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        } else {
            var newUnsavedAttributes = this.unsavedAttributes
                .filter((attribute)=> {
                    return !Immutable.is(attribute, attributeValue);
                }).toList();
            this.unsavedAttributes = newUnsavedAttributes;
        }
    }

    resetNewAttributeValue() {
        var attributeDefinition:any = {};
        attributeDefinition.name = LocaleTextsFactory.toLocaleTexts({});
        var localAttributedefinition = AttributeDefinitionFactory.createAttributeDefinition(attributeDefinition);
        this.newAttributeValue = AttributeValueFactory.createAttributeValue({
            value: LocaleTextsFactory.toLocaleTexts({}),
            attributeDefinition: localAttributedefinition
        });
    }


    private saveItemVariant(itemVariant:ItemVariant):Promise<ItemVariant> {
        if (this.pictureTouched) {
            var picture = PictureFactory.createNewPicture(this.itemVariantModel.mainPicture);
            return this.pictureService.save(picture)
                .then((localPic:Picture)=> {
                    this.pictureTouched = false;
                    itemVariant = <ItemVariant>itemVariant.set('mainPicture', localPic);
                    return this.saveItemVariant(itemVariant);
                });
        }
        return this.itemVariantService.save(itemVariant)
            .then((ref)=> {
                return this.itemVariantService.get(ref.id);
            })
            .then((itemVariant:ItemVariant) => {
                this.itemVariant = itemVariant;
                this.itemVariantModel = itemVariant.toJS();

                if (this.unsavedAttributes.size > 0) {
                    var newAttributeTask = [];
                    this.unsavedAttributes.forEach((attribute)=> {
                        newAttributeTask.push(this.saveAttributeValue(attribute));
                    });
                    return Promise.all(newAttributeTask)
                        .then((results:AttributeValue[])=> {
                            this.unsavedAttributes = Immutable.List([]);
                            var allAttributes = this.itemVariant.attributeValues;
                            for (var savedValue of results) {
                                allAttributes.push(savedValue);
                            }
                            var newItemVariant = <ItemVariant>this.itemVariant.set('attributeValues', allAttributes);
                            return this.itemVariantService.save(newItemVariant);
                        })
                        .then((ref)=> {
                            return this.itemVariantService.get(ref.id);
                        })
                        .then((itemVariant)=> {
                            this.itemVariant = itemVariant;
                            this.itemVariantModel = itemVariant.toJS();
                            if (this.itemVariant.mainPicture != null) {
                                this.picture = this.itemVariant.mainPicture;
                            }
                            return itemVariant;
                        });
                } else {
                    return itemVariant;
                }
            });
    }

    private saveAttributeValue(attributevalue:AttributeValue):Promise<AttributeValue> {
        var attributeDefinitionName = attributevalue.attributeDefinition.name.get(this.editLanguage.locale);
        return this.searchAttributeDefinitionForName(attributeDefinitionName)
            .then((attributeDefinition)=> {
                if (attributeDefinition == null) {
                    var toSaveDefinitionJs:any = attributevalue.attributeDefinition.toJS();
                    toSaveDefinitionJs.company = this.authService.getEmployeeCompany();
                    var toSaveDefinition:AttributeDefinition = AttributeDefinitionFactory.createAttributeDefinition(toSaveDefinitionJs);
                    return this.saveAttributeDefinition(toSaveDefinition);
                } else {
                    return attributeDefinition;
                }
            })
            .then((attributeDefinition)=> {
                var updatedAttributeValue = <AttributeValue>attributevalue
                    .set('attributeDefinition', attributeDefinition);
                return this.attributeValueService.save(updatedAttributeValue);
            })
            .then((ref)=> {
                return this.attributeValueService.get(ref.id);
            });
    }

    private saveAttributeDefinition(attributeDefinition:AttributeDefinition):Promise<AttributeDefinition> {
        return this.attributeDefinitionService.save(attributeDefinition)
            .then((ref)=> {
                return this.attributeDefinitionService.get(ref.id);
            });
    }

    private searchAttributeDefinitionForName(name:string):Promise<AttributeDefinition> {
        var attributeDefRequest = new SearchRequest<AttributeDefinition>();
        var search = new WsAttributeDefinitionSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        search.nameContains = name;
        attributeDefRequest.search = search;

        return this.attributeDefinitionService.search(attributeDefRequest)
            .then((result:SearchResult<AttributeDefinition>) => {
                if (result.list.size === 0) {
                    return null;
                }
                return result.list.first();
            });
    }

}
