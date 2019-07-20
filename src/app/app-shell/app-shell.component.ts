import {Component, OnInit} from '@angular/core';
import {AppMenuService} from './app-menu.service';
import {Observable} from 'rxjs';
import {MenuItem, MessageService} from 'primeng/api';

@Component({
  selector: 'cp-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {

  appMenu$: Observable<MenuItem[]>;

  constructor(
    private appMenuService: AppMenuService,
    public messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.appMenu$ = this.appMenuService.createAppMenu$();
  }

}
