import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {EmployeeService} from '../../domain/thirdparty/employee.service';
import {RouteUtils} from '../../util/route-utils';

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
              private employeeService: EmployeeService) {
    this.formHelper = new ShellFormHelper<WsEmployee>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'employee')
      .subscribe(employee => this.formHelper.init(employee as WsEmployee));
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
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsEmployee): Observable<ValidationResult<WsEmployee>> {
    return of(ValidationResultFactory.emptyResults<WsEmployee>());
  }

  private persist$(value: WsEmployee): Observable<WsEmployee> {
    if (value.id == null) {
      return this.employeeService.createEmployee$(value).pipe(
        mergeMap(createdRef => this.employeeService.getEmployee$(createdRef)),
      );
    } else {
      return this.employeeService.updateEmployee$(value).pipe(
        mergeMap(createdRef => this.employeeService.getEmployee$(createdRef)),
      );
    }
  }
}
