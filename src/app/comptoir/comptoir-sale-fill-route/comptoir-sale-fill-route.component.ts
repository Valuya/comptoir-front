import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WsItemVariantRef, WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {MessageService} from 'primeng/api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {Router} from '@angular/router';
import {SaleItemListComponent} from '../sale-item-list/sale-item-list.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'cp-comptoir-sale-fill-route',
  templateUrl: './comptoir-sale-fill-route.component.html',
  styleUrls: ['./comptoir-sale-fill-route.component.scss']
})
export class ComptoirSaleFillRouteComponent implements OnInit, OnDestroy {

  @ViewChild(SaleItemListComponent, {static: true})
  private saleItemListChild: SaleItemListComponent;

  private subscription: Subscription;

  constructor(
    private messageService: MessageService,
    private saleService: ComptoirSaleService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.subscription = this.saleService.getLastUpdatedItem$()
      .subscribe(item => this.scrollToUpdatedItem(item));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onVariantSelected(ref: WsItemVariantRef) {
    this.saleService.createSaleIfRequired$()
      .subscribe((newSale) => this.router.navigate(['/comptoir/sale', newSale.id, 'fill']),
        error => console.error(error),
        () => {
          this.saleService.addVariant(ref);
          this.notifyAdded();
        }
      );
  }

  private notifyAdded() {
    this.messageService.add({
      severity: 'info',
      life: 500,
      summary: 'Adding 1'
    });
  }

  private scrollToUpdatedItem(item: WsItemVariantSale) {
    this.saleItemListChild.highlightUpdatedItem(item);
  }
}
