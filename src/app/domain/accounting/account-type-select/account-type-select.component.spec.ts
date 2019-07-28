import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTypeSelectComponent } from './account-type-select.component';

describe('AccountTypeSelectComponent', () => {
  let component: AccountTypeSelectComponent;
  let fixture: ComponentFixture<AccountTypeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTypeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
