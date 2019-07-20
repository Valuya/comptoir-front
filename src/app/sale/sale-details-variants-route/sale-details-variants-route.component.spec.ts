import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleDetailsVariantsRouteComponent} from './sale-details-variants-route.component';

describe('SaleDetailsVariantsRouteComponent', () => {
  let component: SaleDetailsVariantsRouteComponent;
  let fixture: ComponentFixture<SaleDetailsVariantsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDetailsVariantsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailsVariantsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
