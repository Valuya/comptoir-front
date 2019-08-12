import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountColumnComponent} from './account-column.component';

describe('AccountColumnComponent', () => {
  let component: AccountColumnComponent;
  let fixture: ComponentFixture<AccountColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
