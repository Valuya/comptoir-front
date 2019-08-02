import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockDetailsVariantsRouteComponent} from './stock-details-variants-route.component';

describe('StockDetailsVariantsRouteComponent', () => {
  let component: StockDetailsVariantsRouteComponent;
  let fixture: ComponentFixture<StockDetailsVariantsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsVariantsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsVariantsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
