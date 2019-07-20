import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsEmployee, WsEmployeeRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-employees-details-route',
  templateUrl: './employee-details-route.component.html',
  styleUrls: ['./employee-details-route.component.scss'],

})
export class EmployeeDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsEmployee>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsEmployee>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.employee),
    ).subscribe(employee => this.formHelper.init(employee));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedEmployee => this.onSaveSuccess(updatedEmployee),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving employee`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedEmployee) {
    this.messageService.add({
      severity: 'success',
      summary: `Employee ${updatedEmployee.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsEmployee): Observable<ValidationResult<WsEmployee>> {
    return of(ValidationResultFactory.emptyResults<WsEmployee>());
  }

  private persist$(value: WsEmployee): Observable<WsEmployee> {
    if (value.id == null) {
      const created$ = this.apiService.api.createEmployee({
        wsEmployee: value
      }) as any as Observable<WsEmployeeRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getEmployee({
          id: ref.id
        }))
      ) as any as Observable<WsEmployee>;
    } else {
      const updated$ = this.apiService.api.updateEmployee({
        id: value.id,
        wsEmployee: value
      }) as any as Observable<WsEmployeeRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getEmployee({
          id: ref.id
        }))
      ) as any as Observable<WsEmployee>;
    }
  }
}
