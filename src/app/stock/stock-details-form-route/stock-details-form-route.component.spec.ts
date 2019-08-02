import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockDetailsFormRouteComponent} from './stock-details-form-route.component';

describe('StockDetailsFormRouteComponent', () => {
  let component: StockDetailsFormRouteComponent;
  let fixture: ComponentFixture<StockDetailsFormRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsFormRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
