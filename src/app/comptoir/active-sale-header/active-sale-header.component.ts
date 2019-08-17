import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {WsSalePriceDetails} from '@valuya/comptoir-ws-api/dist/models/WsSalePriceDetails';

@Component({
  selector: 'cp-active-sale-header',
  templateUrl: './active-sale-header.component.html',
  styleUrls: ['./active-sale-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveSaleHeaderComponent implements OnInit {

  CLOSE_SALE_CONFIRM_MESSAGE_KEY = 'close-sale-confirm';

  @Input()
  fillRoute: boolean;
  @Input()
  payRoute: boolean;

  sale$: Observable<WsSale>;
  salePrice$: Observable<WsSalePriceDetails>;
  saleRef$: Observable<WsSaleRef>;
  saleTotalPaid$: Observable<number>;
  saleRemaining$: Observable<number>;
  saleItemsCount$: Observable<number>;
  updating$: Observable<boolean>;

  constructor(
    private saleService: ComptoirSaleService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();
    this.salePrice$ = this.saleService.getSalePrice$();
    this.saleRef$ = this.saleService.getSaleRef$();
    this.saleTotalPaid$ = this.saleService.getSaleTotalPaid$();
    this.saleRemaining$ = this.saleService.getSaleRemainingToPay$();
    this.updating$ = this.saleService.isUpdating$();
    this.saleItemsCount$ = this.saleService.getItemsTableHelper().totalCount$;
  }

  onSaleChanged(ref: WsSaleRef) {
    const idParam = ref == null ? 'new' : ref.id;
    this.router.navigate(['/comptoir', 'sale', idParam]);
  }

  onSaleUpdate(saleUpdate: Partial<WsSale>) {
    this.saleService.updateSale(saleUpdate);
  }

  onPayClick() {
    this.router.navigate(['./pay'], {
      relativeTo: this.activatedRoute
    });
  }

  onFillClick() {
    this.router.navigate(['./fill'], {
      relativeTo: this.activatedRoute
    });
  }

  onCloseClick() {
    this.saleRemaining$.pipe(
      take(1),
    ).subscribe(remaining => this.closeSaleWithRemainingCheck(remaining));

  }

  onReopenClick() {
    this.saleService.reopenActiveSale$()
      .subscribe(ref => {
        this.router.navigate(['../', ref.id, 'fill'], {
          relativeTo: this.activatedRoute,
          replaceUrl: true,
        });
      });
  }

  onCloseConfirmRejected() {
    this.messageService.clear(this.CLOSE_SALE_CONFIRM_MESSAGE_KEY);
  }

  onCloseConfirmed() {
    this.messageService.clear(this.CLOSE_SALE_CONFIRM_MESSAGE_KEY);
    this.closeSaleAndGoToNewSale();
  }

  getRedirectUrl() {
    return this.router.routerState.snapshot.url;
  }

  onTotalVatInclusiveChange(value: number) {
    this.saleService.updateSalePrice('totalPriceVatInclusive', value);
  }

  onDiscountAmountChange(value: number) {
    this.saleService.updateSalePrice('saleDiscountAmount', value);
  }

  onDiscountRatioChange(value: number) {
    this.saleService.updateSalePrice('saleDiscountRatio', value);
  }

  private closeSaleWithRemainingCheck(remaining: number) {
    if (remaining === 0) {
      this.closeSaleAndGoToNewSale();
    } else if (remaining > 0) {
      // TODO: i18n
      this.messageService.add({
        key: this.CLOSE_SALE_CONFIRM_MESSAGE_KEY,
        summary: 'Vente non payée',
        detail: `Cette vente n'est pas entièrement payée. \n`
          + `Une ristourne va devoir être créée.`,
        sticky: true,
        severity: 'warn'
      });
    } else if (remaining < 0) {
      // TODO: i18n
      this.messageService.add({
        key: this.CLOSE_SALE_CONFIRM_MESSAGE_KEY,
        summary: 'Vente avec cash à rendre',
        detail: `Cette vente a reçu plus de paiments que le montant dû.\n`
          + `La différence sera traitée comme du cash rendu au client.`,
        sticky: true,
        severity: 'warn'
      });
    }
  }

  private closeSaleAndGoToNewSale() {
    this.saleService.closeActiveSale$()
      .subscribe(() => {
        this.router.navigate(['../new/fill'], {
          relativeTo: this.activatedRoute
        });
      });
  }

}
