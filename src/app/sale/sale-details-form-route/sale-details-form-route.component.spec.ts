import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleDetailsFormRouteComponent} from './sale-details-form-route.component';

describe('SaleDetailsFormRouteComponent', () => {
  let component: SaleDetailsFormRouteComponent;
  let fixture: ComponentFixture<SaleDetailsFormRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDetailsFormRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailsFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
