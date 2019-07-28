import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTransactionInputComponent } from './sale-transaction-input.component';

describe('SaleTransactionInputComponent', () => {
  let component: SaleTransactionInputComponent;
  let fixture: ComponentFixture<SaleTransactionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleTransactionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTransactionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
