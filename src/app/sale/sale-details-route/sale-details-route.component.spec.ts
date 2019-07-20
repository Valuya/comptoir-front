import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailsRouteComponent } from './sale-details-route.component';

describe('SaleDetailsRouteComponent', () => {
  let component: SaleDetailsRouteComponent;
  let fixture: ComponentFixture<SaleDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
