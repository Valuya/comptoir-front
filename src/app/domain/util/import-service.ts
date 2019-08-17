import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {WsCompanyRef, WsImportSummary, WsPrestashopImportParams} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private apiService: ApiService) {

  }


  importPrestashop(companyRef: WsCompanyRef, backend: string, params: WsPrestashopImportParams): Observable<WsImportSummary> {
    return this.apiService.api.importPrestashop({
      companyId: companyRef.id,
      backendName: backend,
      wsPrestashopImportParams: params
    });
  }
}
