/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsCustomer} from "../client/domain/thirdparty/customer";
import {WsCompanyRef} from "../client/domain/company/company";
import {Customer, CustomerFactory} from "../domain/thirdparty/customer";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {CustomerClient} from "../client/client/customer";
import {AuthService} from "./auth";
import {CompanyService} from "./company";
import {WsUtils} from "../client/utils/wsClient";
import {Http, Request} from "angular2/http";
import {ApplicationRequestCache} from "../client/utils/applicationRequestCache";

@Injectable()
export class CustomerService {

    customerClient:CustomerClient;
    authService:AuthService;
    companyService:CompanyService;
    private http:Http;

    constructor(customerClient:CustomerClient,
                authService:AuthService,
                companyService:CompanyService,
                http:Http) {
        this.customerClient = customerClient;
        this.authService = authService;
        this.companyService = companyService;
        this.http = http;
    }

    get(id:number):Promise<Customer> {
        return this.customerClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsCustomer)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.customerClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:Customer):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.customerClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<Customer>):Promise<SearchResult<Customer>> {
        return this.customerClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsCustomer>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<Customer>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    getLoyaltyBalance(id:number):Promise<number> {
        var url = this.customerClient.webServiceUrl + this.customerClient.resourcePath + '/' + id + '/loyaltyBalance';
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.method = 'GET';
        options.url = url;
        var request = this.http.request(new Request(options));
        request =  ApplicationRequestCache.registerRequest(request);
        return request
            .map(response=> {
                if (response.text() == null || response.text().length <= 0) {
                    return 0;
                }
                var amountValue:any = JSON.parse(response.text());
                var amount = parseFloat(amountValue.value);
                if (isNaN(amount)) {
                    return 0;
                }
                return amount;
            })
            .toPromise();
    }

    toLocalConverter(customer:WsCustomer):Promise<Customer> {
        var localCustomerDesc:any = {};
        localCustomerDesc.address1 = customer.adress1;
        localCustomerDesc.address2 = customer.adress2;
        localCustomerDesc.city = customer.city;
        localCustomerDesc.email = customer.email;
        localCustomerDesc.firstName = customer.firstName;
        localCustomerDesc.id = customer.id;
        localCustomerDesc.lastName = customer.lastName;
        localCustomerDesc.notes = customer.notes;
        localCustomerDesc.phone1 = customer.phone1;
        localCustomerDesc.phone2 = customer.phone2;
        localCustomerDesc.zip = customer.zip;

        var taskList = [];
        var companyRef = customer.companyRef;

        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((company)=> {
                    localCustomerDesc.company = company;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return CustomerFactory.createNewCustomer(localCustomerDesc);
            });
    }

    fromLocalConverter(localCustomer:Customer):WsCustomer {
        var customer = new WsCustomer();
        customer.adress1 = localCustomer.address1;
        customer.adress2 = localCustomer.address2;
        customer.city = localCustomer.city;
        customer.companyRef = new WsCompanyRef(localCustomer.company.id);
        customer.email = localCustomer.email;
        customer.firstName = localCustomer.firstName;
        customer.id = localCustomer.id;
        customer.lastName = localCustomer.lastName;
        customer.notes = localCustomer.notes;
        customer.phone1 = localCustomer.phone1;
        customer.phone2 = localCustomer.phone2;
        customer.zip = localCustomer.zip;
        return customer;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}