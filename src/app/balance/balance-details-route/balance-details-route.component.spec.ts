import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceDetailsRouteComponent } from './balance-details-route.component';

describe('BalanceDetailsRouteComponent', () => {
  let component: BalanceDetailsRouteComponent;
  let fixture: ComponentFixture<BalanceDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
