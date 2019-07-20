import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDetailsRouteComponent } from './pos-details-route.component';

describe('PoDetailsRouteComponent', () => {
  let component: PoDetailsRouteComponent;
  let fixture: ComponentFixture<PoDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
