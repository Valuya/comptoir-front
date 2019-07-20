import {Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {AppMenuService} from '../app-menu.service';
import {ContentHeaderActionsDirective} from './content-header-actions.directive';
import {ContentBodyDirective} from './content-body.directive';

@Component({
  selector: 'cp-shell-content-page',
  templateUrl: './shell-content-page.component.html',
  styleUrls: ['./shell-content-page.component.scss']
})
export class ShellContentPageComponent implements OnInit {

  @Input()
  routePath: MenuItem[];

  @ContentChildren(ContentHeaderActionsDirective, {read: TemplateRef, descendants: true})
  headerActionsTemplates: QueryList<TemplateRef<any>>;

  @ContentChild(ContentBodyDirective, {static: false, read: TemplateRef})
  bodyTemplateRef: TemplateRef<any>;

  breadcrumbMenu$: Observable<MenuItem[]>;

  constructor(private menuService: AppMenuService) {

  }

  ngOnInit() {
    this.breadcrumbMenu$ = this.menuService.breadcrumbMenu$;
  }

}
