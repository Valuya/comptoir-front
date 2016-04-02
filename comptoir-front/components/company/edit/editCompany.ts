/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit, Input, Output} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {LocalCompany, LocalCompanyFactory} from "../../../domain/company";
import {WsCompanyRef} from "../../../client/domain/company/company";
import {Language, LanguageFactory, NewLanguage} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {CompanyService} from "../../../services/company";
import {ErrorService} from "../../../services/error";
import {LangSelect} from "../../lang/langSelect/langSelect";
import {LocalizedDirective} from "../../utils/localizedInput";
import {RequiredValidator} from "../../utils/validators";
import {FormMessage} from "../../utils/formMessage/formMessage";
import {NumberUtils} from "../../../client/utils/number";
import {WsCountry} from "../../../client/domain/company/country";
import {CountryService} from "../../../services/country";


@Component({
    selector: 'company-edit-component',
    templateUrl: './components/company/edit/editCompany.html',
    styleUrls: ['./components/company/edit/editCompany.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class CompanyEditComponent implements OnInit {
    companyService:CompanyService;
    errorService:ErrorService;
    authService:AuthService;
    countryService:CountryService;

    @Input()
    company:LocalCompany;

    companyModel:any;
    companyLoyaltyPercentage:number;

    editLanguage:Language;
    appLanguage:Language;

    // TODO: LocalCountry
    allCountries:Immutable.List<WsCountry>;

    @Output()
    saved = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();

    constructor(companyService:CompanyService, authService:AuthService,
                countryService:CountryService, errorService:ErrorService) {
        this.companyService = companyService;
        this.authService = authService;
        this.countryService = countryService;
        this.errorService = errorService;
        this.editLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
        this.appLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
        this.searchCountries();
    }

    ngOnInit() {
        this.companyModel = this.company.toJS();
        var loyaltyRate = this.company.customerLoyaltyRate;
        this.setLoyaltyPercentage(loyaltyRate);
    }


    onFormSubmit() {
        var loyaltyrate = NumberUtils.toFixedDecimals(this.companyLoyaltyPercentage / 100, 2);
        this.companyModel.customerLoyaltyRate = loyaltyrate;
        var newCompany = LocalCompanyFactory.createNewCompany(this.companyModel);

        this.saveCompany(newCompany)
            .then((company)=> {
                this.saved.emit(company);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.emit(null);
    }

    onCountrySelected(event) {
        var code:string = event.target.value;
        var country:WsCountry = this.allCountries.toSeq()
            .filter(country=>country.code == code)
            .first();
        this.companyModel.country = country;
    }

    onLanguageChanged(language: Language) {
        this.editLanguage = language;
    }

    private searchCountries() {
        var authToken = this.authService.authToken;

        this.countryService.search(authToken)
            .then((countries)=> {
                this.allCountries = countries;
                if (this.companyModel.country == null) {
                    this.companyModel.country = countries.first();
                }
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    private saveCompany(company:LocalCompany):Promise<LocalCompany> {
        var authToken = this.authService.authToken;


        return this.companyService.save(company, authToken)
            .then((ref:WsCompanyRef)=> {
                return this.companyService.get(ref.id, authToken);
            })
            .then((company:LocalCompany)=> {
                this.company = company;
                this.companyModel = company.toJS();
                this.setLoyaltyPercentage(company.customerLoyaltyRate);
                return company;
            });
    }

    private setLoyaltyPercentage(loyaltyrate:number) {
        var loyaltyPercentage = NumberUtils.toFixedDecimals(loyaltyrate * 100, 0);
        this.companyLoyaltyPercentage = loyaltyPercentage;
    }

}
