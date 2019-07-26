import {Component, Input, OnInit} from '@angular/core';
import {WsItemVariantPricingEnum} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PricingService} from './pricing.service';

@Component({
  selector: 'cp-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  @Input()
  set pricing(value: WsItemVariantPricingEnum) {
    this.pricingSource$.next(value);
  }

  pricingSource$ = new BehaviorSubject<WsItemVariantPricingEnum | null>(null);
  label$: Observable<string>;

  constructor(
    private pricingService: PricingService,
  ) {
  }

  ngOnInit() {
    this.label$ = this.pricingSource$.pipe(
      map(p => this.pricingService.getLabel(p)),
    );
  }

}
