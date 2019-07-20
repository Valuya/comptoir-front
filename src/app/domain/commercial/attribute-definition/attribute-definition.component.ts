import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ApiService} from '../../../api.service';
import {WsAttributeDefinition, WsAttributeDefinitionRef} from '@valuya/comptoir-ws-api';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';

@Component({
  selector: 'cp-attribute-definition',
  templateUrl: './attribute-definition.component.html',
  styleUrls: ['./attribute-definition.component.scss']
})
export class AttributeDefinitionComponent implements OnInit {

  @Input()
  set ref(value: WsAttributeDefinitionRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsAttributeDefinitionRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  labelLocaleText$: Observable<WsLocaleText[]>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.labelLocaleText$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      map(definition => definition.name as WsLocaleText[]),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsAttributeDefinitionRef): Observable<WsAttributeDefinition> {
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getAttributeDefinition({
      id: ref.id
    }) as any as Observable<WsAttributeDefinition>;
    return loaded$.pipe(
      tap(def => this.loading$.next(false))
    );
  }
}
