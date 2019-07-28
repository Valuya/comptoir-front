import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectListItemComponent } from './account-select-list-item.component';

describe('AccountSelectListItemComponent', () => {
  let component: AccountSelectListItemComponent;
  let fixture: ComponentFixture<AccountSelectListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
