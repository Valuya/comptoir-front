import {Component, OnInit} from '@angular/core';
import {WsCompany, WsImportSummary, WsPrestashopImportParams} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable} from 'rxjs';
import {ImportService} from '../../domain/util/import-service';
import {delay, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'cp-presathop-import',
  templateUrl: './presathop-import.component.html',
  styleUrls: ['./presathop-import.component.scss']
})
export class PresathopImportComponent implements OnInit {

  importForm: WsPrestashopImportParams;
  backendName = 'prestashop';

  importing$ = new BehaviorSubject<boolean>(false);
  importedSummary: WsImportSummary;

  private company$: Observable<WsCompany>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private importService: ImportService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.importForm = {
      driverClassName: 'org.mariadb.jdbc.Driver',
      dbUrl: 'jdbc:mariadb://',
    };
    this.company$ = this.activatedRoute.data.pipe(
      map(data => data.company),
      publishReplay(1), refCount()
    );
  }

  onFormSubmit() {
    this.importing$.next(true);
    this.company$.pipe(
      take(1),
      switchMap(company => this.importService.importPrestashop({id: company.id}, this.backendName, this.importForm)),
      delay(0),
    ).subscribe(
      summary => this.onImportSuccess(summary),
      error => this.onImportError(error),
      () => this.importing$.next(false)
    );
  }

  closeSummary() {
    this.importedSummary = null;
  }

  private onImportSuccess(summary: WsImportSummary) {
    this.importedSummary = summary;
  }

  private onImportError(error: any) {
    this.importing$.next(false);
    this.messageService.add({
      severity: 'error',
      summary: 'Import errored',
      detail: `${error}`,
      closable: true,
      sticky: true
    });
  }

}
