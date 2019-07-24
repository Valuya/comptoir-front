import { Component, OnInit } from '@angular/core';
import {ComptoirService} from '../comptoir-service';

@Component({
  selector: 'cp-comptoir-info-route',
  templateUrl: './comptoir-info-route.component.html',
  styleUrls: ['./comptoir-info-route.component.scss']
})
export class ComptoirInfoRouteComponent implements OnInit {

  constructor(public comptoirService: ComptoirService) { }

  ngOnInit() {
  }

}
