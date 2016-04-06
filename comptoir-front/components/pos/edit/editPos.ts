/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit, Input, Output} from 'angular2/core';
import {NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/common';

import {Pos, PosFactory} from '../../../domain/commercial/pos';
import {WsPosRef} from '../../../client/domain/commercial/pos';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';

import {LangSelectComponent} from '../../lang/langSelect/langSelect';
import {LocalizedInputDirective} from '../../lang/localizedInput/localizedInput';
import {RequiredValidator} from '../../utils/validators';
import {FormMessageComponent} from '../../utils/formMessage/formMessage';


@Component({
    selector: 'pos-edit',
    templateUrl: './components/pos/edit/editPos.html',
    styleUrls: ['./components/pos/edit/editPos.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelectComponent, LocalizedInputDirective,
        RequiredValidator, FormMessageComponent]
})
export class PosEditComponent implements OnInit {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;

    @Input()
    pos:Pos;

    @Output()
    saved = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();

    posModel:any;
    editLanguage:Language;
    appLanguage:Language;

    constructor(posService:PosService, authService:AuthService, errorService:ErrorService) {
        this.posService = posService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
    }

    ngOnInit() {
        this.posModel = this.pos;
    }


    onFormSubmit() {
        this.savePos(this.pos)
            .then((pos)=> {
                this.saved.next(pos);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.next(null);
    }


    private savePos(pos:Pos):Promise<Pos> {
        return this.posService.save(pos)
            .then((ref:WsPosRef)=> {
                return this.posService.get(ref.id);
            })
            .then((pos:Pos)=> {
                this.pos = pos;
                this.posModel = pos.toJS();
                return pos;
            });
    }

}
