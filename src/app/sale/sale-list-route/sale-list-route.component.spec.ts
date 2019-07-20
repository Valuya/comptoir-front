import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleListRouteComponent } from './sale-list-route.component';

describe('SaleListRouteComponent', () => {
  let component: SaleListRouteComponent;
  let fixture: ComponentFixture<SaleListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
