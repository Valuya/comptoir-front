import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'cp-active-sale-header',
  templateUrl: './active-sale-header.component.html',
  styleUrls: ['./active-sale-header.component.scss']
})
export class ActiveSaleHeaderComponent implements OnInit {

  sale$: Observable<WsSale>;
  saleRef$: Observable<WsSaleRef>;

  constructor(
    private saleService: ComptoirSaleService,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();
    this.saleRef$ = this.saleService.getSaleRef$();
  }

  onSaleChanged(ref: WsSaleRef) {
    const idParam = ref == null ? 'new' : ref.id;
    this.router.navigate(['/comptoir', 'sale', idParam]);
  }

  onSaleUpdate(saleUpdate: Partial<WsSale>) {
    this.saleService.updateSale(saleUpdate);
  }
}
