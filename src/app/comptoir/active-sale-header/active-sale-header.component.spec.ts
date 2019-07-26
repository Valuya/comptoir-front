import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSaleHeaderComponent } from './active-sale-header.component';

describe('ActiveSaleHeaderComponent', () => {
  let component: ActiveSaleHeaderComponent;
  let fixture: ComponentFixture<ActiveSaleHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSaleHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSaleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
