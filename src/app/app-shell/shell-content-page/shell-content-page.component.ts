import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
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

  @ContentChild(ContentHeaderActionsDirective, {static: false, read: TemplateRef})
  headerActionsTemplate: TemplateRef<any>;

  @ContentChild(ContentBodyDirective, {static: false, read: TemplateRef})
  bodyTemplateRef: TemplateRef<any>;

  breadcrumbMenu$: Observable<MenuItem[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private menuService: AppMenuService) {

  }

  ngOnInit() {
    this.breadcrumbMenu$ = this.menuService.createBreadcrumbMenuFromRoute$(this.activatedRoute);
  }

}
