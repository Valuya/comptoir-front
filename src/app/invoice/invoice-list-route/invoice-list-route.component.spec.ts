import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceListRouteComponent} from './invoice-list-route.component';

describe('InvoiceListRouteComponent', () => {
  let component: InvoiceListRouteComponent;
  let fixture: ComponentFixture<InvoiceListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
