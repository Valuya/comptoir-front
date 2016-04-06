/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Pos, PosFactory} from '../../../domain/commercial/pos';

import {AuthService} from '../../../services/auth';
import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';

import {LocaleTexts} from '../../../client/utils/lang';
import {PosEditComponent} from '../../../components/pos/edit/editPos';

@Component({
    templateUrl: './routes/pos/edit/editView.html',
    styleUrls: ['./routes/pos/edit/editView.css'],
    directives: [NgIf, RouterLink, PosEditComponent]
})
export class EditPosView {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    pos:Pos;


    constructor(posService:PosService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.posService = posService;
        this.authService = authService;
        this.errorService = appService;

        this.findPos(routeParams);
    }

    findPos(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewPos();
            return;
        }
        var itemIdParam = routeParams.get('id');
        var posId = parseInt(itemIdParam);
        if (isNaN(posId)) {
            if (itemIdParam === 'new') {
                this.getNewPos();
                return;
            }
            this.getNewPos();
            return;
        }
        this.getPos(posId);
    }

    getNewPos() {
        var posDesc: any = {};
        posDesc.company = this.authService.getEmployeeCompany();
        posDesc.description = new LocaleTexts();
        this.pos = PosFactory.createNewPos(posDesc);
    }

    getPos(id:number) {
        this.posService.get(id)
            .then((pos)=> {
                this.pos = pos;
            });
    }

    onSaved(pos) {
        this.posService.save(pos)
            .then(()=> {
                this.router.navigate(['/Pos/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelled() {
        this.router.navigate(['/Pos/List']);
    }

}
