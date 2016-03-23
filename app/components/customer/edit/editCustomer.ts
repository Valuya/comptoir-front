/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {LocalCustomer, LocalCustomerFactory} from "../../../client/localDomain/customer";
import {CustomerRef, CustomerFactory} from "../../../client/domain/customer";
import {Language} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {CustomerService} from "../../../services/customer";
import {ErrorService} from "../../../services/error";
import {LangSelect} from "../../lang/langSelect/langSelect";
import {LocalizedDirective} from "../../utils/localizedInput";
import {RequiredValidator} from "../../utils/validators";
import {FormMessage} from "../../utils/formMessage/formMessage";


@Component({
    selector: 'customer-edit-component',
    inputs: ['customer'],
    outputs: ['saved', 'cancelled'],
    templateUrl: './components/customer/edit/editCustomer.html',
    styleUrls: ['./components/customer/edit/editCustomer.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class CustomersEditComponent implements OnInit {
    customerService:CustomerService;
    errorService:ErrorService;
    authService:AuthService;

    customer:LocalCustomer;
    customerModel:any;

    editLanguage:Language;
    appLanguage:Language;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(customerService:CustomerService, authService:AuthService, errorService:ErrorService) {
        this.customerService = customerService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
    }

    ngOnInit() {
        this.customerModel = this.customer.toJS();
    }


    onFormSubmit() {
        var newCustomer = LocalCustomerFactory.createNewCustomer(this.customerModel);
        this.saveCustomer(newCustomer)
            .then((customer)=> {
                this.saved.emit(customer);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.emit(null);
    }


    private saveCustomer(customer:LocalCustomer):Promise<LocalCustomer> {
        return this.customerService.save(customer)
            .then((ref:CustomerRef)=> {
                return this.customerService.get(ref.id);
            })
            .then((customer:LocalCustomer)=> {
                this.customer = customer;
                this.customerModel = customer.toJS();
                return customer;
            });
    }

}
