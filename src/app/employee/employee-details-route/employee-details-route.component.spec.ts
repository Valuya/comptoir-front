import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeDetailsRouteComponent} from './employee-details-route.component';

describe('EmployeeDetailsRouteComponent', () => {
  let component: EmployeeDetailsRouteComponent;
  let fixture: ComponentFixture<EmployeeDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
