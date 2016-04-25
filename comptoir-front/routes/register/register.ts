/**
 * Created by cghislai on 07/08/15.
 */
import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {FormMessageComponent} from '../../components/utils/formMessage/formMessage';
import {LangSelectComponent, LangSelectControl} from '../../components/lang/langSelect/langSelect';
import {RequiredValidator, PasswordValidator} from '../../components/utils/validators';
import {LocalizedInputDirective} from '../../components/lang/localizedInput/localizedInput';

import {WsCountry} from '../../client/domain/company/country';
import {Company, CompanyFactory} from '../../domain/company/company';
import {Employee, EmployeeFactory} from '../../domain/thirdparty/employee';
import {Language, LanguageFactory, LocaleTextsFactory, NewLanguage} from '../../client/utils/lang';

import {AuthService} from '../../services/auth';
import {ErrorService} from '../../services/error';
import {CompanyService} from '../../services/company';
import {EmployeeService} from '../../services/employee';
import {CompanyEditComponent} from "../../components/company/edit/editCompany";
import {WsCompanyFactory, WsCompany} from "../../client/domain/company/company";
import {WsRegistration} from "../../client/domain/thirdparty/registration";

@Component({
    templateUrl: './routes/register/register.html',
    styleUrls: ['./routes/register/register.css'],
    directives: [FORM_DIRECTIVES, NgFor,  RouterLink, AppHeaderComponent, FormMessageComponent,
        LangSelectComponent, LangSelectControl, LocalizedInputDirective,
        RequiredValidator, PasswordValidator, CompanyEditComponent]
})
export class RegisterView {
    authService:AuthService;
    errorService: ErrorService;
    companyService: CompanyService;
    employeeService: EmployeeService;
    router:Router;

    company: Company;
    companySaved: boolean;
    editingEmployee: any;
    password: string;

    appLanguage:Language;

    constructor(authService:AuthService, errorService:ErrorService,
                companyService: CompanyService, employeeService: EmployeeService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.companyService = companyService;
        this.employeeService = employeeService;
        this.router = router;

        this.appLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());

        this.company = CompanyFactory.createNewCompany({
            name: LocaleTextsFactory.toLocaleTexts({}),
            description: LocaleTextsFactory.toLocaleTexts({})
        });
        this.editingEmployee = {};
        this.editingEmployee.language = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
    }

    onCompanySaved(company: Company) {
        this.company = company;
        this.companySaved = true;
    }

    onCancelled() {
        this.router.navigate(['/Login']);
    }
    doRegister() {
        var registration = new WsRegistration();
        var localCompany:Company = CompanyFactory.createNewCompany(this.company);
        var company:WsCompany = this.companyService.fromLocalConverter(localCompany);
        this.editingEmployee.locale = this.editingEmployee.language.locale;
        var localEmployee:Employee = EmployeeFactory.createNewEmployee(this.editingEmployee);
        var employee = this.employeeService.fromLocalConverter(localEmployee);
        registration.company =company;
        registration.employee = employee;

        registration.employeePassword = this.password;

        this.authService.register(registration)
            .then((employee)=> {
                this.router.navigate(['/Sales/Sale', {id: 'active'}]);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }


}