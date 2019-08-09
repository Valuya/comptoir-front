import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePrintRouteComponent } from './sale-print-route.component';

describe('SalePrintRouteComponent', () => {
  let component: SalePrintRouteComponent;
  let fixture: ComponentFixture<SalePrintRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePrintRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePrintRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
