import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountListRouteComponent} from './account-list-route.component';

describe('AccountListRouteComponent', () => {
  let component: AccountListRouteComponent;
  let fixture: ComponentFixture<AccountListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
