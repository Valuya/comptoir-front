import {Component, Input, OnInit} from '@angular/core';
import {WsCountry} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {CountryService} from '../country.service';

@Component({
  selector: 'cp-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  @Input()
  set ref(value: string | null) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<string | null>(null);
  country$: Observable<WsCountry>;
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private countryService: CountryService,
  ) {
  }

  ngOnInit() {
    this.country$ = this.refSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private fetchRef$(ref: string | null) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.countryService.getCountry$(ref).pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
