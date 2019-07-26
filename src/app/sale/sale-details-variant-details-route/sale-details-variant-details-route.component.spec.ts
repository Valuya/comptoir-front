import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleDetailsVariantDetailsRouteComponent} from './sale-details-variant-details-route.component';

describe('SaleDetailsVariantDetailsRouteComponent', () => {
  let component: SaleDetailsVariantDetailsRouteComponent;
  let fixture: ComponentFixture<SaleDetailsVariantDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDetailsVariantDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailsVariantDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
