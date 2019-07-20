import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListRouteComponent } from './customer-list-route.component';

describe('CustomerListRouteComponent', () => {
  let component: CustomerListRouteComponent;
  let fixture: ComponentFixture<CustomerListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
