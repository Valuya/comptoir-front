import {Injectable} from '@angular/core';
import {BehaviorSubject, concat, Observable, of, Subject} from 'rxjs';
import {WsCompany, WsCompanyRef, WsCustomerRef, WsPosRef} from '@valuya/comptoir-ws-api';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {MessageService} from 'primeng/api';
import {CompanyService} from '../domain/commercial/company.service';
import {ComptoirSaleService} from './comptoir-sale.service';

@Injectable({
  providedIn: 'root'
})
export class ComptoirService {

  pointOfSaleRef$ = new BehaviorSubject<WsPosRef | null>(null);
  defaultCustomerRef$ = new BehaviorSubject<WsCustomerRef | null>(null);

  customerLoyaltyAmount$: Observable<number>;
  customerLoyaltyAmountReloadTrigger$ = new Subject<any>();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private comptoirSaleService: ComptoirSaleService,
    private companyService: CompanyService
  ) {
    this.customerLoyaltyAmount$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(
      switchMap(ref => this.reemitOnReload$(ref, this.customerLoyaltyAmountReloadTrigger$)),
      switchMap(ref => this.fetchCompany$(ref)),
      map(c => c.customerLoyaltyRate),
      publishReplay(1), refCount()
    );
  }

  setPos(posRef: WsPosRef) {
    this.pointOfSaleRef$.next(posRef);
  }

  setDefaultCustomer(customerRef: WsCustomerRef) {
    this.defaultCustomerRef$.next(customerRef);
  }

  setCustomerLoyaltyRate(rate: number) {
    this.authService.getLoggedEmployeeCompanyRef$().pipe(
      switchMap(ref => this.fetchCompany$(ref)),
      map(c => Object.assign({}, c, {
        customerLoyaltyRate: rate
      } as Partial<WsCompany>) as WsCompany),
      switchMap(company => this.updateCompany$(company))
    ).subscribe(
      ref => this.onLoyaltyRateUpdated(),
      e => this.showUpdateError(e),
    );
  }

  private onLoyaltyRateUpdated() {
    this.messageService.add({
      severity: 'info',
      summary: `Loyalty rate updated`,
    });
    this.customerLoyaltyAmountReloadTrigger$.next(true);
  }

  private fetchCompany$(ref: WsCompanyRef) {
    return this.companyService.getCompany$(ref);
  }

  private updateCompany$(company: WsCompany) {
    return this.companyService.saveCompany(company);
  }

  private reemitOnReload$(ref: WsCompanyRef, subject: Subject<any>): Observable<WsCompanyRef> {
    return concat(
      of(ref),
      subject
    ).pipe(
      map(() => ref)
    );
  }

  private showUpdateError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: `Failed to submit update`,
      detail: `${error}`
    });
  }
}
