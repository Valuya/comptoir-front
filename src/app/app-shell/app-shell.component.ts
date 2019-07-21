import {Component, OnInit} from '@angular/core';
import {AppMenuService} from './app-menu.service';
import {Observable} from 'rxjs';
import {MenuItem, MessageService} from 'primeng/api';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'cp-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  animations: [
    trigger('collapsed', [
      state('true', style({
        marginLeft: '-10em',
      })),
      state('false', style({
        marginLeft: '0',
      })),
      transition('* => *', [
        animate('.3s ease-out')
      ]),
    ])
  ]
})
export class AppShellComponent implements OnInit {

  appMenu$: Observable<MenuItem[]>;
  breadcrumbMenu$: Observable<MenuItem[]>;
  quickActionsMenu$: Observable<MenuItem[]>;

  menuCollapsed$: Observable<boolean>;

  constructor(
    private appMenuService: AppMenuService,
    public messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.appMenu$ = this.appMenuService.appMenu$;
    this.breadcrumbMenu$ = this.appMenuService.breadcrumbMenu$;
    this.quickActionsMenu$ = this.appMenuService.quickActions$;
    this.menuCollapsed$ = this.appMenuService.appMenuCollapsed$;
  }


  onShowMenuClick() {
    this.appMenuService.expandAppMenu();
  }

}
