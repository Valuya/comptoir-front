import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PosDetailsRouteComponent} from './pos-details-route.component';

describe('PoDetailsRouteComponent', () => {
  let component: PosDetailsRouteComponent;
  let fixture: ComponentFixture<PosDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
