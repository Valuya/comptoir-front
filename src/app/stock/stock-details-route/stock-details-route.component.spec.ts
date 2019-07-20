import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockDetailsRouteComponent} from './stock-details-route.component';

describe('StockDetailsRouteComponent', () => {
  let component: StockDetailsRouteComponent;
  let fixture: ComponentFixture<StockDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
