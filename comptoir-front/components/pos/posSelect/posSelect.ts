/**
 * Created by cghislai on 31/08/15.
 */

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "angular2/core";
import {NgIf, NgFor} from "angular2/common";
import {Pos} from "../../../domain/commercial/pos";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {Language} from "../../../client/utils/lang";
import {PosService} from "../../../services/pos";
import {AuthService} from "../../../services/auth";
import {ErrorService} from "../../../services/error";
import * as Immutable from "immutable";
import {WsPos} from "../../../client/domain/commercial/pos";
import {WsPosSearch} from "../../../client/domain/search/posSearch";

@Component({
    selector: 'pos-select',
    templateUrl: './components/pos/posSelect/posSelect.html',
    directives: [NgFor, NgIf],
    encapsulation: ViewEncapsulation.None
})
export class PosSelect {
    posService:PosService;
    authService:AuthService;
    errorService:ErrorService;

    searchRequest:SearchRequest<Pos>;
    posList:Immutable.List<Pos>;
    language:Language;

    @Input()
    editable:boolean;
    @Input()
    pos:Pos;
    @Output()
    posChanged = new EventEmitter();

    constructor(posService:PosService, authService:AuthService, errorService:ErrorService) {
        this.posService = posService;
        this.authService = authService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();

        this.searchRequest = new SearchRequest<WsPos>();
        var posSearch = new WsPosSearch();
        posSearch.companyRef = authService.getEmployeeCompanyRef();
        this.searchRequest.search = posSearch;
        this.posList = Immutable.List([]);
        this.searchPos();
    }

    searchPos() {
        this.posService.search(this.searchRequest)
            .then((result:SearchResult<Pos>)=> {
                this.posList = result.list;
                if (this.pos == null) {
                    var lastUsedPos = this.posService.lastUsedPos;
                    if (lastUsedPos != null) {
                        this.setPos(lastUsedPos);
                    } else if (result.list.size > 0) {
                        var pos = result.list.first();
                        this.setPos(pos);
                    }
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPosChanged(event) {
        var posId:number = parseInt(event.target.value);
        var pos = this.posList.toSeq()
            .filter((pos)=> {
                return pos.id === posId;
            })
            .first();
        this.setPos(pos);
    }

    setPos(pos:Pos) {
        this.pos = pos;
        this.posService.lastUsedPos = this.pos;
        this.posChanged.emit(pos);
    }

}
