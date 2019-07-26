import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PosListRouteComponent} from './pos-list-route.component';

describe('PoListRouteComponent', () => {
  let component: PosListRouteComponent;
  let fixture: ComponentFixture<PosListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
