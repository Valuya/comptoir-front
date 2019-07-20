import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerDetailsRouteComponent} from './customer-details-route.component';

describe('CustomerDetailsRouteComponent', () => {
  let component: CustomerDetailsRouteComponent;
  let fixture: ComponentFixture<CustomerDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
