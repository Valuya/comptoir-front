import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {AuthService} from '../../auth.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'cp-logout-route',
  templateUrl: './logout-route.component.html',
  styleUrls: ['./logout-route.component.scss']
})
export class LogoutRouteComponent implements OnInit {

  constructor(private navigationService: NavigationService,
              private authService: AuthService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.authService.clearAuth();
    this.messageService.add({
      severity: 'info',
      summary: 'Logged out'
    });
    this.navigationService.navigateWithRedirectCheck(['/login']);
  }

}
