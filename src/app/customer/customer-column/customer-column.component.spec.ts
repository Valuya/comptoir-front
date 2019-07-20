import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerColumnComponent } from './customer-column.component';

describe('CustomerColumnComponent', () => {
  let component: CustomerColumnComponent;
  let fixture: ComponentFixture<CustomerColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
