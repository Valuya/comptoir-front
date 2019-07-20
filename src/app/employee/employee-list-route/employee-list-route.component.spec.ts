import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListRouteComponent } from './employee-list-route.component';

describe('EmployeeListRouteComponent', () => {
  let component: EmployeeListRouteComponent;
  let fixture: ComponentFixture<EmployeeListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
