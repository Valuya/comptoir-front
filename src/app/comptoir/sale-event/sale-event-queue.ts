import {SaleEvent} from './sale-event';
import {Observable, Subject} from 'rxjs';

export class SaleEventQueue {

  private event$ = new Subject<SaleEvent>();

  constructor() {
  }

  getEvents$(): Observable<SaleEvent> {
    return this.event$;
  }

  push(event: SaleEvent) {
    this.event$.next(event);
  }

}
