/**
 * Created by cghislai on 06/08/15.
 */

import {Injectable} from 'angular2/core';

import {WsCompanyRef} from '../client/domain/company/company';

import {Employee, EmployeeFactory} from '../domain/thirdparty/employee';
import {Account} from '../domain/accounting/account';

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

    get(id:number, authToken:string):Promise<Employee> {
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

    save(entity:Employee, authToken:string):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.employeeClient.doSave(e, authToken)
            .toPromise();
    }

    search(searchRequest:SearchRequest<Employee>, authToken:string):Promise<SearchResult<Employee>> {
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
                        var localResult = new SearchResult<Employee>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(employee:WsEmployee, authToken:string):Promise<Employee> {
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
                return EmployeeFactory.createNewEmployee(localEmployeeDesc);
            });
    }

    fromLocalConverter(localEmployee:Employee):WsEmployee {
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