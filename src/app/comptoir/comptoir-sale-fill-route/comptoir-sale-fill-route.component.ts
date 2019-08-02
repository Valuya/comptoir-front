import {Component, OnInit} from '@angular/core';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {MessageService} from 'primeng/api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'cp-comptoir-sale-fill-route',
  templateUrl: './comptoir-sale-fill-route.component.html',
  styleUrls: ['./comptoir-sale-fill-route.component.scss']
})
export class ComptoirSaleFillRouteComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private saleService: ComptoirSaleService,
    private router: Router,
  ) {
  }

  ngOnInit() {
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
}
