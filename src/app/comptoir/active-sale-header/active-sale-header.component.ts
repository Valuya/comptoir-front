import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'cp-active-sale-header',
  templateUrl: './active-sale-header.component.html',
  styleUrls: ['./active-sale-header.component.scss']
})
export class ActiveSaleHeaderComponent implements OnInit {

  @Input()
  fillRoute: boolean;
  @Input()
  payRoute: boolean;

  sale$: Observable<WsSale>;
  saleRef$: Observable<WsSaleRef>;
  saleTotalPaid$: Observable<number>;

  constructor(
    private saleService: ComptoirSaleService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();
    this.saleRef$ = this.saleService.getSaleRef$();
    this.saleTotalPaid$ = this.saleService.getSaleTotalPaid$();
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
}
