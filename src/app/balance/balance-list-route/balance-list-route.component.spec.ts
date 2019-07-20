import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceListRouteComponent } from './balance-list-route.component';

describe('BalanceListRouteComponent', () => {
  let component: BalanceListRouteComponent;
  let fixture: ComponentFixture<BalanceListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
