/**
 * Created by cghislai on 07/08/15.
 */
import {Injectable} from "angular2/core";
import {WsAuth, WsAuthFactory} from "../client/domain/auth/auth";
import {Auth, AuthFactory} from "../domain/auth/auth";
import {Employee} from "../domain/thirdparty/employee";
import {Company} from "../domain/company/company";
import {WsCompanyRef} from "../client/domain/company/company";
import {WsEmployeeRef} from "../client/domain/thirdparty/employee";
import {Language, LanguageFactory} from "../client/utils/lang";
import {JSONFactory} from "../client/utils/factory";
import {ComptoirRequest, ComptoirResponse} from "../client/utils/request";
import {AuthClient} from "../client/client/auth";
import {EmployeeService} from "./employee";
import {MD5} from "../components/utils/md5";
import {WsRegistration} from "../client/domain/thirdparty/registration";

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

@Injectable()
export class AuthService {
    static STORAGE_AUTH_KEY = "Auth";

    client:AuthClient;
    employeeService:EmployeeService;

    authToken:string;
    auth:Auth;
    registrationRequest:ComptoirRequest;

    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    loadingPromise:Promise<any>;

    constructor(authClient:AuthClient,
                employeeService:EmployeeService) {
        this.client = authClient;
        this.employeeService = employeeService;
        this.loadFromStorage();
    }

    public login(login:string, hashedPassword:string):Promise<Employee> {
        return this.client.login(login, hashedPassword)
            .then((response:WsAuth) => {
                return this.toLocalAuth(response, response.token);
            }).then((localAuth:Auth)=> {
                if (localAuth.employee == null || localAuth.token == null) {
                    throw 'Invalid auth retrieved';
                }
                this.saveAuth(localAuth);
                return localAuth.employee;
            });
    }

    // Register then log in
    public register(registration:WsRegistration):Promise<Employee> {
        if (this.registrationRequest != null) {
            console.log("Registration already running");
            return;
        }
        this.registrationRequest = this.client.getRegisterRequest(registration);
        return this.registrationRequest.run()
            .then((response:ComptoirResponse)=> {
                var companyRef = JSON.parse(response.text);
                console.log('Successfully registered for company #' + companyRef.id);
                var login = registration.employee.login;
                var password = registration.employeePassword;
                var hashedPassword = MD5.encode(password);
                return this.login(login, hashedPassword);
            });
    }

    public getEmployeeLanguage():Language {
        if (this.auth == null) {
            return LanguageFactory.DEFAULT_LANGUAGE;
        }
        var employee = this.auth.employee;
        if (employee == null) {
            return LanguageFactory.DEFAULT_LANGUAGE;
        }
        var locale = employee.locale;
        var language = LanguageFactory.fromLocale(locale);
        if (language !== undefined) {
            return language;
        }
        return LanguageFactory.DEFAULT_LANGUAGE;
    }

    public getEmployeeCompany():Company {
        if (this.auth == null) {
            return null;
        }
        var employee = this.auth.employee;
        if (employee == null) {
            return null;
        }
        return employee.company;
    }

    public getEmployeeCompanyRef():WsCompanyRef {
        var company = this.getEmployeeCompany();
        if (company == null) {
            return null;
        }
        return new WsCompanyRef(company.id);
    }


    isExpireDateValid(date:Date) {
        // Handle null case
        if (date === undefined) {
            return false;
        }
        var nowDate = Date.now();
        return nowDate < date.getTime();
    }

    isExpireDateGettingClose(date:Date) {
        if (date == null) {
            return false;
        }
        var nowTime = Date.now();
        var expireTime = date.getTime();
        var remainingMs = expireTime - nowTime;
        var fiveMinutesMs = 5 * 60 * 1000;
        return remainingMs < fiveMinutesMs;
    }

    checkRefreshToken():Promise<any> {
        if (this.loadingPromise != null) {
            return this.loadingPromise;
        }
        if (this.auth == null) {
            return Promise.resolve();
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateGettingClose(expireDate)) {
            return Promise.resolve();
        }
        var refreshToken = this.auth.refreshToken;
        return this.client.refreshToken(refreshToken)
            .then((auth)=> {
                return this.toLocalAuth(auth, auth.token)
            }).then((localAuth:Auth)=> {
                this.saveAuth(localAuth);
            });
    }

    checkLoggedIn():Promise<boolean> {
        if (this.loadingPromise != null) {
            return this.loadingPromise.then(()=> {
                return this.checkLoggedIn();
            });
        }
        if (this.auth == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return Promise.resolve(false);
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return Promise.resolve(false);
        }

        this.loginRequired = false;
        this.loginRequiredReason = null;

        this.checkRefreshToken();
        return Promise.resolve(true);
    }

    private loadFromStorage() {
        this.auth = null;
        this.authToken = null;

        var authJSON = localStorage.getItem(AuthService.STORAGE_AUTH_KEY);
        if (authJSON == null || typeof authJSON != 'object') {
            this.clearAuth();
            return;
        }

        var auth:WsAuth = JSON.parse(authJSON, WsAuthFactory.fromJSONReviver);
        if (auth == null) {
            this.clearAuth();
            return;
        }
        var expireDate = auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.clearAuth();
            return;
        }

        this.loadingPromise = this.toLocalAuth(auth, auth.token)
            .then((localAuth:Auth)=> {
                this.auth = localAuth;
                this.loadingPromise = null;
                return this.checkRefreshToken();
            });
    }

    private clearAuth() {
        this.auth = null;
        this.authToken = null;
        localStorage.setItem(AuthService.STORAGE_AUTH_KEY, null);
    }

    private saveAuth(auth:Auth) {
        if (Immutable.is(this.auth, auth)) {
            return;
        }
        if (auth == null) {
            this.clearAuth();
            return;
        }

        this.auth = auth;
        this.authToken = auth.token;
        var wsAuth = this.fromLocalAuth(auth);
        var jsonString = JSON.stringify(wsAuth, JSONFactory.toJSONReplacer);
        localStorage.setItem(AuthService.STORAGE_AUTH_KEY, jsonString);

        var self = this;
        var expireDate = auth.expirationDateTime;
        var expireTime = expireDate.getTime();
        var nowDate = new Date();
        var nowTime = nowDate.getTime();
        var expireTimeDiff = expireTime - nowTime;
        // Recheck 1 min before expiration
        var checkExpireTimeDiff = expireTimeDiff - 60000;
        setTimeout(function () {
            self.checkRefreshToken();
        }, checkExpireTimeDiff)
    }

    toLocalAuth(auth:WsAuth, authToken:string):Promise<Auth> {
        var localAuthDesc:any = {};
        localAuthDesc.id = auth.id;
        localAuthDesc.token = auth.token;
        localAuthDesc.refreshToken = auth.refreshToken;
        localAuthDesc.expirationDateTime = auth.expirationDateTime;

        var taskList = [];
        var employeeRef = auth.employeeRef;

        taskList.push(
            this.employeeService.get(employeeRef.id, authToken)
                .then((localEmployee:Employee)=> {
                    localAuthDesc.employee = localEmployee;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return AuthFactory.createNewAuth(localAuthDesc);
            });
    }

    fromLocalAuth(localAuth:Auth):WsAuth {
        var auth = new WsAuth();
        auth.id = localAuth.id;
        auth.token = localAuth.token;
        auth.refreshToken = localAuth.refreshToken;
        auth.expirationDateTime = localAuth.expirationDateTime;
        auth.employeeRef = new WsEmployeeRef(localAuth.employee.id);
        return auth;
    }
}
