import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InvoiceColumnComponent} from './invoice-column.component';

describe('InvoiceColumnComponent', () => {
  let component: InvoiceColumnComponent;
  let fixture: ComponentFixture<InvoiceColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
