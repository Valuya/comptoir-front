import {Component, OnInit} from '@angular/core';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {MessageService} from 'primeng/api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'cp-comptoir-sale-fill-route',
  templateUrl: './comptoir-sale-fill-route.component.html',
  styleUrls: ['./comptoir-sale-fill-route.component.scss']
})
export class ComptoirSaleFillRouteComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private saleService: ComptoirSaleService,
  ) {
  }

  ngOnInit() {
  }

  onVariantSelected(ref: WsItemVariantRef) {
    this.saleService.addVariant(ref);
    // .pipe(
    //   switchMap(saleVariantRef => this.saleService.getVariantAddedLabel$(saleVariantRef))
    // ).subscribe(
    //   variantLabel => this.onVariantAdded(variantLabel),
    //   error => this.onVariantAddError(error)
    // );
  }

  private onVariantAdded(label: string) {
    this.messageService.add({
      severity: 'info',
      summary: label,
    });
  }

  private onVariantAddError(error: any) {
    this.messageService.add({
      severity: 'info',
      summary: `Failed to add item`,
      detail: error
    });
  }
}
