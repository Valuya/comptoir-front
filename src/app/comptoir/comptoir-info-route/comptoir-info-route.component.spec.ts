import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptoirInfoRouteComponent } from './comptoir-info-route.component';

describe('ComptoirInfoRouteComponent', () => {
  let component: ComptoirInfoRouteComponent;
  let fixture: ComponentFixture<ComptoirInfoRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptoirInfoRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptoirInfoRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
