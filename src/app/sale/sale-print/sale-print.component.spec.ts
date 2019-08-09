import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePrintComponent } from './sale-print.component';

describe('SalePrintComponent', () => {
  let component: SalePrintComponent;
  let fixture: ComponentFixture<SalePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
