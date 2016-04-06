/**
 * Created by cghislai on 29/09/15.
 */
import {Component, EventEmitter, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Account} from '../../../domain/accounting/account';
import {Balance, BalanceFactory} from '../../../domain/accounting/balance';
import {MoneyPile, ALL_CASH_TYPES, MoneyPileFactory} from '../../../domain/cash/moneyPile';

import {NumberUtils} from '../../../client/utils/number';

import {BalanceService} from '../../../services/balance';
import {MoneyPileService} from '../../../services/moneyPile';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';

import {MoneyPileCountComponent} from '../../cash/moneyPile/moneyPileCount';
import {FastInputDirective} from '../../utils/fastInput';

import * as Immutable from 'immutable';

@Component({
    selector: 'balance-count',
    inputs: ['account'],
    outputs: ['validated', 'cancelled'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/cash/balance/countComponent.html',
    styleUrls: ['./components/cash/balance/countComponent.css'],
    directives: [NgFor, NgIf, MoneyPileCountComponent, FastInputDirective]
})

export class BalanceCountComponent implements OnInit {
    authService:AuthService;
    errorService:ErrorService;
    moneyPileService:MoneyPileService;
    balanceService:BalanceService;

    account:Account;
    balance:Balance;
    moneyPiles:Immutable.List<MoneyPile>;

    editingTotal:boolean;

    validated = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(authService:AuthService, errorService:ErrorService,
                moneyPileService:MoneyPileService, balanceService:BalanceService) {
        this.authService = authService;
        this.errorService = errorService;
        this.balanceService = balanceService;
        this.moneyPileService = moneyPileService;
    }

    ngOnInit() {
        this.initBalance();
    }

    initBalance() {
        this.moneyPiles = Immutable.List(ALL_CASH_TYPES)
            .map((cashType)=> {
                return MoneyPileFactory.createNewMoneyPile({
                    account: this.account,
                    unitCount: null,
                    unitAmount: MoneyPileFactory.getCashTypeUnitValue(cashType),
                    label: MoneyPileFactory.getCashTypeLabel(cashType)
                });
            })
            .toList();
        this.balance = BalanceFactory.createNewBalance({
            account: this.account,
            balance: 0,
            company: this.authService.getEmployeeCompany()
        });
        this.editingTotal = false;
    }

    onMoneyPileChanged(moneyPile) {
        var listIndex = this.moneyPiles
            .findIndex((inMoneyPile)=> {
                return inMoneyPile.unitAmount === moneyPile.unitAmount;
            });
        var CashType = ALL_CASH_TYPES[listIndex];

        this.saveBalanceIfRequired()
            .then((balance)=> {
                moneyPile = <MoneyPile>moneyPile.set('balance', balance);
                return this.moneyPileService.save(moneyPile);
            })
            .then((ref:any)=> {
                var taskList:Promise<any>[] = <Promise<any>[]>[
                    this.moneyPileService.get(ref.id),
                    this.balanceService.fetch(  this.balance.id)
                ];
                return Promise.all(taskList);
            })
            .then((results)=> {
                var newMoneyPile = results[0];
                newMoneyPile = newMoneyPile.set('label', MoneyPileFactory.getCashTypeLabel(CashType));
                var newBalance = results[1];
                this.balance = newBalance;
                this.moneyPiles = this.moneyPiles.set(listIndex, newMoneyPile);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    startEditTotal() {
        this.editingTotal = true;
        if (this.balance.balance == null) {
            this.balance.balance = 0;
        }
    }

    onTotalCancelled() {
        this.editingTotal = false;
        // Refetch total
        return this.saveBalanceIfRequired()
            .then((balance)=> {
                balance = <Balance>balance.set('balance', null);
                return this.balanceService.save(balance);
            })
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:Balance)=> {
                this.balance = balance;
            });
    }

    onTotalChanged(newValue) {
        var total = parseFloat(newValue);
        if (isNaN(total)) {
            this.editingTotal = false;
            return;
        }
        total = NumberUtils.toFixedDecimals(total, 2);
        var balanceJs = this.balance.toJS();
        balanceJs.balance = total;
        var newBalance = BalanceFactory.createNewBalance(balanceJs);

        this.balanceService.save(newBalance)
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:Balance)=> {
                this.balance = balance;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.editingTotal = false;
    }

    onValidateBalanceClicked() {
        this.saveBalanceIfRequired()
            .then(()=> {
                return this.balanceService.closeBalance(this.balance);
            })
            .then((ref)=> {
                return this.balanceService.fetch(ref.id);
            })
            .then((balance:Balance)=> {
                this.validated.emit(balance);
                this.initBalance();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    private saveBalanceIfRequired():Promise<Balance> {
        if (this.balance.id != null) {
            return Promise.resolve(this.balance);
        }
        return this.balanceService.save(this.balance)
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:Balance)=> {
                this.balance = balance;
                return balance;
            });
    }

}
