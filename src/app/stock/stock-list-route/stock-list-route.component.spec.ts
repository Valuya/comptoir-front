import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockListRouteComponent} from './stock-list-route.component';

describe('StockListRouteComponent', () => {
  let component: StockListRouteComponent;
  let fixture: ComponentFixture<StockListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
