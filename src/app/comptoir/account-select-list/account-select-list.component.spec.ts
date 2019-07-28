import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectListComponent } from './account-select-list.component';

describe('AccountSelectListComponent', () => {
  let component: AccountSelectListComponent;
  let fixture: ComponentFixture<AccountSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
