import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsCompany, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {CompanyService} from '../company.service';

@Component({
  selector: 'cp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyComponent implements OnInit {

  @Input()
  set ref(value: WsCompanyRef) {
    this.refSOurce$.next(value);
  }
  @Input()
  showName: boolean;
  @Input()
  showDescription: boolean;

  refSOurce$ = new BehaviorSubject<WsCompanyRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  company$: Observable<WsCompany>;


  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
    this.company$ = this.refSOurce$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private fetchRef$(ref: WsCompanyRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);

    return this.companyService.getCompany$(ref).pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
