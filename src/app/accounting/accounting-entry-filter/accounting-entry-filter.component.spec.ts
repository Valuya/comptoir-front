import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEntryFilterComponent } from './accounting-entry-filter.component';

describe('AccountingEntryFilterComponent', () => {
  let component: AccountingEntryFilterComponent;
  let fixture: ComponentFixture<AccountingEntryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingEntryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEntryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
