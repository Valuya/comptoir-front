import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoListRouteComponent } from './pos-list-route.component';

describe('PoListRouteComponent', () => {
  let component: PoListRouteComponent;
  let fixture: ComponentFixture<PoListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
