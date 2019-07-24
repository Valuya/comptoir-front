import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptoirSaleRouteComponent } from './comptoir-sale-route.component';

describe('ComptoirSaleRouteComponent', () => {
  let component: ComptoirSaleRouteComponent;
  let fixture: ComponentFixture<ComptoirSaleRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptoirSaleRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptoirSaleRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
