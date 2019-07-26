import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceDetailsRouteComponent} from './invoice-details-route.component';

describe('InvoiceDetailsRouteComponent', () => {
  let component: InvoiceDetailsRouteComponent;
  let fixture: ComponentFixture<InvoiceDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
