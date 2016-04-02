/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Customer, CustomerFactory} from '../../../domain/thirdparty/customer';

import {AuthService} from '../../../services/auth';
import {CustomerService} from '../../../services/customer';
import {ErrorService} from '../../../services/error';

import {LocaleTexts} from '../../../client/utils/lang';
import {CustomersEditComponent} from '../../../components/customer/edit/editCustomer';

@Component({
    selector: 'edit-customer',
    templateUrl: './routes/customer/edit/editView.html',
    styleUrls: ['./routes/customer/edit/editView.css'],
    directives: [NgIf, RouterLink, CustomersEditComponent]
})
export class EditCustomerView {
    customerService:CustomerService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    customer:Customer;


    constructor(customerService:CustomerService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.customerService = customerService;
        this.authService = authService;
        this.errorService = appService;

        this.findCustomer(routeParams);
    }

    findCustomer(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewCustomer();
            return;
        }
        var itemIdParam = routeParams.get('id');
        var customerId = parseInt(itemIdParam);
        if (isNaN(customerId)) {
            if (itemIdParam === 'new') {
                this.getNewCustomer();
                return;
            }
            this.getNewCustomer();
            return;
        }
        this.getCustomer(customerId);
    }

    getNewCustomer() {
        var customerDesc: any = {};
        customerDesc.company = this.authService.getEmployeeCompany();
        customerDesc.description = new LocaleTexts();
        this.customer = CustomerFactory.createNewCustomer(customerDesc);
    }

    getCustomer(id:number) {
        this.customerService.get(id)
            .then((customer)=> {
                this.customer = customer;
            });
    }

    onSaved(customer) {
        this.customerService.save(customer)
            .then(()=> {
                this.router.navigate(['/Customer/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelled() {
        this.router.navigate(['/Customer/List']);
    }

}
