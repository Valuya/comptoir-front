import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsCompany} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {CompanyService} from '../../domain/commercial/company.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-companys-details-route',
  templateUrl: './company-details-route.component.html',
  styleUrls: ['./company-details-route.component.scss'],
})
export class CompanyDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsCompany>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private companyService: CompanyService) {
    this.formHelper = new ShellFormHelper<WsCompany>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'company')
      .subscribe(company => this.formHelper.init(company));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedCompany => this.onSaveSuccess(updatedCompany),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving company`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedCompany) {
    this.messageService.add({
      severity: 'success',
      summary: `Company ${updatedCompany.id} saved`
    });
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsCompany): Observable<ValidationResult<WsCompany>> {
    return of(ValidationResultFactory.emptyResults<WsCompany>());
  }

  private persist$(value: WsCompany): Observable<WsCompany> {
    return this.companyService.saveCompany(value).pipe(
      mergeMap(createdRef => this.companyService.getCompany$(createdRef)),
    );
  }
}
