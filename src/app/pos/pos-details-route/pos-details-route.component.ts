import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsPos, WsPosRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {PosService} from '../../domain/commercial/pos.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-pos-details-route',
  templateUrl: './pos-details-route.component.html',
  styleUrls: ['./pos-details-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsPos>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private posService: PosService,
  ) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsPos>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'pos')
      .subscribe(pos => this.formHelper.init(pos as WsPos));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedPos => this.onSaveSuccess(updatedPos),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving pos`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedPos) {
    this.messageService.add({
      severity: 'success',
      summary: `Pos ${updatedPos.id} saved`
    });
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsPos): Observable<ValidationResult<WsPos>> {
    return of(ValidationResultFactory.emptyResults<WsPos>());
  }

  private persist$(value: WsPos): Observable<WsPos> {
    return this.posService.savePos(value).pipe(
      switchMap(ref => this.posService.getPos$(ref))
    );
  }
}
