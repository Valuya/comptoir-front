import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceColumnComponent } from './balance-column.component';

describe('BalanceColumnComponent', () => {
  let component: BalanceColumnComponent;
  let fixture: ComponentFixture<BalanceColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
