import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEntryListRouteComponent } from './accounting-entry-list-route.component';

describe('AccountingEntryListRouteComponent', () => {
  let component: AccountingEntryListRouteComponent;
  let fixture: ComponentFixture<AccountingEntryListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingEntryListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEntryListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
