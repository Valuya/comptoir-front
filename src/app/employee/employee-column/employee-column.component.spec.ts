import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeColumnComponent} from './employee-column.component';

describe('EmployeeColumnComponent', () => {
  let component: EmployeeColumnComponent;
  let fixture: ComponentFixture<EmployeeColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
