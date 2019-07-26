import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptoirSalePayRouteComponent } from './comptoir-sale-pay-route.component';

describe('ComptoirSalePayRouteComponent', () => {
  let component: ComptoirSalePayRouteComponent;
  let fixture: ComponentFixture<ComptoirSalePayRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptoirSalePayRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptoirSalePayRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
