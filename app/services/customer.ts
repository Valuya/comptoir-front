/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {Customer} from "../client/domain/customer";
import {CompanyRef} from "../client/domain/company";
import {LocalCustomer, LocalCustomerFactory} from "../client/localDomain/customer";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {CustomerClient} from "../client/customer";
import {AuthService} from "./auth";
import {CompanyService} from "./company";
import {WsUtils} from "../client/utils/wsClient";
import {Http, Request} from "angular2/http";

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

    get(id:number):Promise<LocalCustomer> {
        return this.customerClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Customer)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.customerClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalCustomer):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.customerClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalCustomer>):Promise<SearchResult<LocalCustomer>> {
        return this.customerClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Customer>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalCustomer>();
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

    toLocalConverter(customer:Customer):Promise<LocalCustomer> {
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

        if (customer.id != null) {
            var id = customer.id;
            taskList.push(
                this.getLoyaltyBalance(id)
                    .then((amount)=> {
                        localCustomerDesc.loyaltyBalance = amount;
                    })
            );
        }
        return Promise.all(taskList)
            .then(()=> {
                return LocalCustomerFactory.createNewCustomer(localCustomerDesc);
            });
    }

    fromLocalConverter(localCustomer:LocalCustomer):Customer {
        var customer = new Customer();
        customer.adress1 = localCustomer.address1;
        customer.adress2 = localCustomer.address2;
        customer.city = localCustomer.city;
        customer.companyRef = new CompanyRef(localCustomer.company.id);
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