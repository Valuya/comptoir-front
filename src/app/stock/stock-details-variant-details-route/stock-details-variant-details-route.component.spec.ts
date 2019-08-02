import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockDetailsVariantDetailsRouteComponent} from './stock-details-variant-details-route.component';

describe('StockDetailsVariantDetailsRouteComponent', () => {
  let component: StockDetailsVariantDetailsRouteComponent;
  let fixture: ComponentFixture<StockDetailsVariantDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsVariantDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsVariantDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
