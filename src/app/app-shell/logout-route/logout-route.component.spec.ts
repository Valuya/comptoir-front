import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutRouteComponent } from './logout-route.component';

describe('LogoutRouteComponent', () => {
  let component: LogoutRouteComponent;
  let fixture: ComponentFixture<LogoutRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
