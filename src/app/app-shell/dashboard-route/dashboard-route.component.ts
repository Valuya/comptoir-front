import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'cp-dashboard-route',
  templateUrl: './dashboard-route.component.html',
  styleUrls: ['./dashboard-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardRouteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
