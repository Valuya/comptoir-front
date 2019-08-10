import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CompanyDetailsRouteComponent} from './company-details-route.component';

describe('CompanyDetailsRouteComponent', () => {
  let component: CompanyDetailsRouteComponent;
  let fixture: ComponentFixture<CompanyDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
