import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptoirSaleFillRouteComponent } from './comptoir-sale-fill-route.component';

describe('ComptoirSaleFillRouteComponent', () => {
  let component: ComptoirSaleFillRouteComponent;
  let fixture: ComponentFixture<ComptoirSaleFillRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptoirSaleFillRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptoirSaleFillRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
