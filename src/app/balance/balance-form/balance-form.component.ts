import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsAccountRef, WsAccountSearch, WsBalance, WsBalanceRef, WsCompanyRef, WsMoneyPile} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {AuthService} from '../../auth.service';
import {AccountService} from '../../domain/accounting/account.service';
import {map, publishReplay, refCount, switchMap, tap, toArray} from 'rxjs/operators';
import {PaginationUtils} from '../../util/pagination-utils';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {WsAttributeDefinitionSearchResultList} from '@valuya/comptoir-ws-api/models/WsAttributeDefinitionSearchResultList';
import {BalanceService} from '../../domain/accounting/balance.service';

@Component({
  selector: 'cp-balance-form',
  templateUrl: './balance-form.component.html',
  styleUrls: ['./balance-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BalanceFormComponent,
      multi: true
    }
  ]
})
export class BalanceFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsBalance>;
  @Input()
  countCashVisible: boolean;

  @Output()
  countClashClick = new EventEmitter<boolean>();
  @Output()
  moneyPilesChange = new EventEmitter<WsMoneyPile[]>();

  valueSource$ = new BehaviorSubject<WsBalance | null>(null);


  private onChange: (value: WsBalance) => void;
  private onTouched: () => void;


  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private balanceService: BalanceService,
  ) {
  }

  ngOnInit() {

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.valueSource$.next(obj);
  }

  updateValue(update: Partial<WsBalance>) {
    const curValue = this.valueSource$.getValue();
    const newValue = Object.assign({}, curValue, update);
    this.fireChanges(newValue);
  }


  private fireChanges(newValue: WsBalance) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }


}
