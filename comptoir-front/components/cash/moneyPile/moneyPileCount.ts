/**
 * Created by cghislai on 29/09/15.
 */
import {Component, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

import {MoneyPile,  MoneyPileFactory} from '../../../domain/cash/moneyPile';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FastInputDirective} from '../../utils/fastInput';


@Component({
    selector: 'moneypile-count',
    inputs: ['moneyPile'],
    outputs: ['changed'],
    templateUrl: './components/cash/moneyPile/moneyPileCount.html',
    styleUrls: ['./components/cash/moneyPile/moneyPileCount.css'],
    directives: [FastInputDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoneyPileCountComponent {
    moneyPile:MoneyPile;
    appLanguage:Language;
    changed = new EventEmitter();

    constructor(authService:AuthService) {
        this.appLanguage = authService.getEmployeeLanguage();
    }

    onMoneyPileChanged(newCount) {
        newCount = parseInt(newCount);
        if (isNaN(newCount) || newCount <= 0) {
            return;
        }
        var moneyPileJS = this.moneyPile.toJS();
        moneyPileJS.unitCount = newCount;
        var newMoneyPile = MoneyPileFactory.createNewMoneyPile(moneyPileJS);
        this.changed.emit(newMoneyPile);
    }
}
