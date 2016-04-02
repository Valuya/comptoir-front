/**
 * Created by cghislai on 06/08/15.
 */

import {Injectable} from 'angular2/core';

import {WsCompanyRef} from '../client/domain/company/company';

import {LocalEmployee, LocalEmployeeFactory} from '../domain/employee';
import {LocalAccount} from '../domain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {EmployeeClient} from '../client/client/employee';
import {CompanyService} from './company';
import {WsEmployee} from "../client/domain/thirdparty/employee";


/**
 * Required by AuthService: Auth -> Employee
 * Do not inject authService
 */
@Injectable()
export class EmployeeService {

    employeeClient:EmployeeClient;
    companyService:CompanyService;

    constructor(employeeClient:EmployeeClient,
                companyService:CompanyService) {
        this.employeeClient = employeeClient;
        this.companyService = companyService;
    }

    get(id:number, authToken:string):Promise<LocalEmployee> {
        return this.employeeClient.doGet(id, authToken)
            .toPromise()
            .then((entity:WsEmployee)=> {
                return this.toLocalConverter(entity, authToken);
            });
    }

    remove(id:number, authToken:string):Promise<any> {
        return this.employeeClient.doRemove(id, authToken)
            .toPromise();
    }

    save(entity:LocalEmployee, authToken:string):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.employeeClient.doSave(e, authToken)
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalEmployee>, authToken:string):Promise<SearchResult<LocalEmployee>> {
        return this.employeeClient.doSearch(searchRequest, authToken)
            .toPromise()
            .then((result:SearchResult<WsEmployee>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity, authToken)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalEmployee>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(employee:WsEmployee, authToken:string):Promise<LocalEmployee> {
        var localEmployeeDesc:any = {};
        localEmployeeDesc.active = employee.active;
        localEmployeeDesc.firstName = employee.firstName;
        localEmployeeDesc.id = employee.id;
        localEmployeeDesc.lastName = employee.lastName;
        localEmployeeDesc.locale = employee.locale;
        localEmployeeDesc.login = employee.login;

        var taskList = [];
        var companyRef = employee.companyRef;

        taskList.push(
            this.companyService.get(companyRef.id, authToken)
                .then((localCompany)=> {
                    localEmployeeDesc.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalEmployeeFactory.createNewEmployee(localEmployeeDesc);
            });
    }

    fromLocalConverter(localEmployee:LocalEmployee):WsEmployee {
        var employee = new WsEmployee();
        employee.active = localEmployee.active;
        if (localEmployee.company != null) {
            employee.companyRef = new WsCompanyRef(localEmployee.company.id);
        }
        employee.firstName = localEmployee.firstName;
        employee.id = localEmployee.id;
        employee.lastName = localEmployee.lastName;
        employee.locale = localEmployee.locale;
        employee.login = localEmployee.login;
        return employee;
    }
}