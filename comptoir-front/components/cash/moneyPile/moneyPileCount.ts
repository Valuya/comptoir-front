/**
 * Created by cghislai on 29/09/15.
 */
import {Component, EventEmitter, ChangeDetectionStrategy, Input, Output} from 'angular2/core';

import {MoneyPile,  MoneyPileFactory} from '../../../domain/cash/moneyPile';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FastInputDirective} from '../../utils/fastInput';


@Component({
    selector: 'moneypile-count',
    templateUrl: './components/cash/moneyPile/moneyPileCount.html',
    styleUrls: ['./components/cash/moneyPile/moneyPileCount.css'],
    directives: [FastInputDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoneyPileCountComponent {
    @Input()
    moneyPile:MoneyPile;

    @Output()
    changed = new EventEmitter();

    appLanguage:Language;

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
