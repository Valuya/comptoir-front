import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEntryColumnComponent } from './accounting-entry-column.component';

describe('AccountingEntryColumnComponent', () => {
  let component: AccountingEntryColumnComponent;
  let fixture: ComponentFixture<AccountingEntryColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingEntryColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEntryColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
