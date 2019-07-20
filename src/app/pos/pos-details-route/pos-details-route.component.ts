import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsPos, WsPosRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-pos-details-route',
  templateUrl: './pos-details-route.component.html',
  styleUrls: ['./pos-details-route.component.scss'],

})
export class PoDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsPos>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsPos>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.pos),
    ).subscribe(pos => this.formHelper.init(pos));
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
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsPos): Observable<ValidationResult<WsPos>> {
    return of(ValidationResultFactory.emptyResults<WsPos>());
  }

  private persist$(value: WsPos): Observable<WsPos> {
    if (value.id == null) {
      const created$ = this.apiService.api.createPos({
        wsPos: value
      }) as any as Observable<WsPosRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getPos({
          id: ref.id
        }))
      ) as any as Observable<WsPos>;
    } else {
      const updated$ = this.apiService.api.updatePos({
        id: value.id,
        wsPos: value,
      }) as any as Observable<WsPosRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getPos({
          id: ref.id
        }))
      ) as any as Observable<WsPos>;
    }
  }
}
