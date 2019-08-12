import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountDetailsRouteComponent} from './account-details-route.component';

describe('AccountDetailsRouteComponent', () => {
  let component: AccountDetailsRouteComponent;
  let fixture: ComponentFixture<AccountDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
