import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectGridItemComponent } from './account-select-grid-item.component';

describe('AccountSelectGridItemComponent', () => {
  let component: AccountSelectGridItemComponent;
  let fixture: ComponentFixture<AccountSelectGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
