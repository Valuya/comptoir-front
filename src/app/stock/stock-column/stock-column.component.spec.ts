import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockColumnComponent } from './stock-column.component';

describe('StockColumnComponent', () => {
  let component: StockColumnComponent;
  let fixture: ComponentFixture<StockColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
