import {AfterContentInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteUtils} from '../../util/route-utils';
import {WsSale} from '@valuya/comptoir-ws-api';
import {delay, filter, map, mergeMap, publishReplay, refCount, take} from 'rxjs/operators';

@Component({
  selector: 'cp-sale-print-route',
  templateUrl: './sale-print-route.component.html',
  styleUrls: ['./sale-print-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalePrintRouteComponent implements OnInit, AfterContentInit {

  sale: WsSale;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const routeSnapshot = this.activatedRoute.snapshot;
    this.sale = RouteUtils.findRouteDataInRouteSnapshotAncestors<WsSale>(routeSnapshot.pathFromRoot, 'sale');

  }

  ngAfterContentInit(): void {
    const queryParams$ = this.activatedRoute.queryParams.pipe(
      publishReplay(1), refCount()
    );
    const redirect$ = queryParams$.pipe(
      map(params => params.redirectUrl),
      publishReplay(1), refCount()
    );
    queryParams$.pipe(
      map(p => p.triggerPrint),
      filter(p => p === 'true'),
      take(1),
      mergeMap(() => redirect$),
      delay(1000)
    ).subscribe(redirectParam => {
      window.print();
      this.redirect(redirectParam);

    });
  }

  private redirect(redirectParam: string | null) {
    if (redirectParam != null) {
      this.router.navigateByUrl(redirectParam);
    } else {
      this.router.navigate(['./'], {
        queryParams: {
          triggerPrint: undefined
        },
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute
      });
    }
  }
}
