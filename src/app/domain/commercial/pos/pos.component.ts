import {Component, Input, OnInit} from '@angular/core';
import {WsPos, WsPosRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {PosService} from '../pos.service';

@Component({
  selector: 'cp-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

  @Input()
  set ref(value: WsPosRef) {
    this.refSource$.next(value);
  }

  refSource$ = new BehaviorSubject<WsPosRef | null>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsPos>;

  constructor(private posService: PosService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsPosRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.posService.getPos$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
