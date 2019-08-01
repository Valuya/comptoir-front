import {Component, OnInit} from '@angular/core';
import {WsAccountingEntry, WsPosRef} from '@valuya/comptoir-ws-api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';
import {ComptoirService} from '../comptoir-service';

@Component({
  selector: 'cp-comptoir-sale-pay-route',
  templateUrl: './comptoir-sale-pay-route.component.html',
  styleUrls: ['./comptoir-sale-pay-route.component.scss']
})
export class ComptoirSalePayRouteComponent implements OnInit {

  entries$: Observable<WsAccountingEntry[]>;
  posRef$: Observable<WsPosRef>;
  remainingAmount$: Observable<number>;

  constructor(
    private saleService: ComptoirSaleService,
    private comptoirService: ComptoirService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.entries$ = this.saleService.getAccountingEntriesTableHelper().rows$;
    this.posRef$ = this.comptoirService.pointOfSaleRef$;
    this.remainingAmount$ = this.saleService.getSaleRemainingToPay$();
  }

  onTransactionAdded(newEntry: WsAccountingEntry) {
    this.saleService.addTransaction(newEntry);
    this.messageService.add({
      severity: 'success',
      summary: 'Payment added'
    });
  }

  onEntryRemoved(entry: WsAccountingEntry) {
    this.saleService.removeTransaction({id: entry.id});
  }
}
