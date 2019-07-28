import {Component, Input, OnInit} from '@angular/core';
import {WsAccount, WsAccountAccountTypeEnum, WsAccountRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable} from 'rxjs';
import {SelectItem} from 'primeng/api';
import {AccountTypeService} from '../account-type.service';
import {map, publishReplay, refCount} from 'rxjs/operators';

@Component({
  selector: 'cp-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {

  @Input()
  set accountType(value: WsAccountAccountTypeEnum) {
    this.typeSource$.next(value);
  }

  private typeSource$ = new BehaviorSubject<WsAccountAccountTypeEnum>(null);
  label$: Observable<string>;

  constructor(
    private accountTypeService: AccountTypeService
  ) {
  }

  ngOnInit() {
    this.label$ = this.typeSource$.pipe(
      map(type => type == null ? null : this.accountTypeService.getLabel(type)),
      publishReplay(1), refCount()
    );
  }

}
