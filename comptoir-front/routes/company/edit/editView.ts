/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from "angular2/core";
import {NgIf} from "angular2/common";
import {RouteParams, Router, RouterLink} from "angular2/router";
import {LocalCompany} from "../../../domain/company";
import {AuthService} from "../../../services/auth";
import {CompanyService} from "../../../services/company";
import {ErrorService} from "../../../services/error";
import {CompanyEditComponent} from "../../../components/company/edit/editCompany";

@Component({
    selector: 'edit-company',
    templateUrl: './routes/company/edit/editView.html',
    styleUrls: ['./routes/company/edit/editView.css'],
    directives: [NgIf, RouterLink, CompanyEditComponent]
})
export class EditCompanyView {
    companyService:CompanyService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    company:LocalCompany;


    constructor(companyService:CompanyService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.companyService = companyService;
        this.authService = authService;
        this.errorService = appService;

        this.findCompany(routeParams);
    }

    findCompany(routeParams:RouteParams) {
        var companyRef = this.authService.getEmployeeCompanyRef();
        this.getCompany(companyRef.id);
    }

    getCompany(id:number) {
        var authToken = this.authService.authToken;
        this.companyService.get(id, authToken)
            .then((company)=> {
                this.company = company;
            });
    }

    onSaved(company) {
        var authToken = this.authService.authToken;

        this.companyService.save(company, authToken)
            .then(()=> {
                this.router.navigate(['/Sales/Actives']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelled() {
        this.router.navigate(['/Sales/Actives']);
    }

}
