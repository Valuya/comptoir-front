import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSaleDetailsComponent } from './active-sale-details.component';

describe('ActiveSaleDetailsComponent', () => {
  let component: ActiveSaleDetailsComponent;
  let fixture: ComponentFixture<ActiveSaleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSaleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
